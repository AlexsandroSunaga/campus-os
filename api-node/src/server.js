import cors from "cors";
import express from "express";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR ?? path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "campus.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, location TEXT, starts_at TEXT);
  CREATE TABLE IF NOT EXISTS passes (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT UNIQUE, event_id INTEGER, email TEXT, checked_in INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, title TEXT, department TEXT, credits INTEGER);
  CREATE TABLE IF NOT EXISTS sections (id INTEGER PRIMARY KEY AUTOINCREMENT, course_id INTEGER, section TEXT, instructor TEXT, seats INTEGER, enrolled INTEGER);
  CREATE TABLE IF NOT EXISTS housing (id INTEGER PRIMARY KEY AUTOINCREMENT, building TEXT, room TEXT, student_email TEXT, status TEXT);
  CREATE TABLE IF NOT EXISTS dining_halls (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, capacity INTEGER, wait INTEGER);
  CREATE TABLE IF NOT EXISTS incidents (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, location TEXT, severity TEXT, status TEXT);
`);

function seedIfEmpty() {
  if (db.prepare("SELECT COUNT(*) as c FROM events").get().c === 0) {
    const e = db.prepare("INSERT INTO events (title, location, starts_at) VALUES (?, ?, ?)");
    e.run("Opening ceremony", "Main hall", "2026-03-01T10:00");
    e.run("Club fair", "Quad", "2026-03-01T14:00");
    e.run("Career expo", "Student union", "2026-03-02T11:00");
  }
  if (db.prepare("SELECT COUNT(*) as c FROM courses").get().c === 0) {
    const c = db.prepare("INSERT INTO courses (code, title, department, credits) VALUES (?, ?, ?, ?)");
    c.run("CS401", "Distributed systems", "Engineering", 4);
    c.run("BUS210", "Operations management", "Business", 3);
    c.run("BIO150", "Cell biology", "Sciences", 4);
    const s = db.prepare("INSERT INTO sections (course_id, section, instructor, seats, enrolled) VALUES (?, ?, ?, ?, ?)");
    s.run(1, "A", "Prof. Nguyen", 120, 118);
    s.run(2, "B", "Prof. Ellis", 80, 72);
    s.run(3, "C", "Prof. Rao", 60, 60);
  }
  if (db.prepare("SELECT COUNT(*) as c FROM housing").get().c === 0) {
    const h = db.prepare("INSERT INTO housing (building, room, student_email, status) VALUES (?, ?, ?, ?)");
    h.run("North Hall", "204", "student1@campus.demo", "occupied");
    h.run("North Hall", "205", "", "vacant");
    h.run("West Village", "12B", "student2@campus.demo", "occupied");
  }
  if (db.prepare("SELECT COUNT(*) as c FROM dining_halls").get().c === 0) {
    const d = db.prepare("INSERT INTO dining_halls (name, capacity, wait) VALUES (?, ?, ?)");
    d.run("Central Dining", 400, 12);
    d.run("South Cafe", 150, 4);
  }
  if (db.prepare("SELECT COUNT(*) as c FROM incidents").get().c === 0) {
    const i = db.prepare("INSERT INTO incidents (category, location, severity, status) VALUES (?, ?, ?, ?)");
    i.run("Facilities", "Library basement", "low", "open");
    i.run("Safety", "Parking garage B", "medium", "investigating");
  }
}
seedIfEmpty();

const queue = { food: 12, gate: 4 };
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_req, res) => res.json({ status: "ok", stack: "express" }));

app.get("/api/v1/integrations/status", (_req, res) => {
  res.json({
    twilio: { enabled: Boolean(process.env.TWILIO_ACCOUNT_SID) },
    sendgrid: { enabled: Boolean(process.env.SENDGRID_API_KEY) },
    auth0: { enabled: Boolean(process.env.AUTH0_DOMAIN) },
    stripe: { enabled: Boolean(process.env.STRIPE_SECRET_KEY) },
  });
});

app.get("/api/v1/command/overview", (_req, res) => {
  res.json({
    events: db.prepare("SELECT COUNT(*) as c FROM events").get().c,
    courses: db.prepare("SELECT COUNT(*) as c FROM courses").get().c,
    housing_occupied: db.prepare("SELECT COUNT(*) as c FROM housing WHERE status='occupied'").get().c,
    dining_wait_total: db.prepare("SELECT SUM(wait) as s FROM dining_halls").get().s ?? 0,
    open_incidents: db.prepare("SELECT COUNT(*) as c FROM incidents WHERE status!='closed'").get().c,
    passes_issued: db.prepare("SELECT COUNT(*) as c FROM passes").get().c,
  });
});

app.get("/api/v1/events", (_req, res) => res.json(db.prepare("SELECT * FROM events").all()));
app.get("/api/v1/courses", (_req, res) => res.json(db.prepare("SELECT * FROM courses").all()));
app.get("/api/v1/sections", (_req, res) => res.json(db.prepare("SELECT * FROM sections").all()));
app.get("/api/v1/housing", (_req, res) => res.json(db.prepare("SELECT * FROM housing").all()));
app.get("/api/v1/dining", (_req, res) => res.json(db.prepare("SELECT * FROM dining_halls").all()));
app.get("/api/v1/incidents", (_req, res) => res.json(db.prepare("SELECT * FROM incidents").all()));

app.post("/api/v1/register", (req, res) => {
  const { event_id, email } = req.body ?? {};
  const token = crypto.randomBytes(16).toString("hex");
  db.prepare("INSERT INTO passes (token, event_id, email) VALUES (?, ?, ?)").run(token, event_id, email);
  res.json({ token, qr_path: `/api/v1/qr/${token}` });
});

app.get("/api/v1/qr/:token", async (req, res) => {
  const png = await QRCode.toBuffer(req.params.token, { type: "png" });
  res.type("png").send(png);
});

app.post("/api/v1/checkin/:token", (req, res) => {
  const row = db.prepare("SELECT * FROM passes WHERE token = ?").get(req.params.token);
  if (!row) return res.status(404).json({ error: "invalid" });
  db.prepare("UPDATE passes SET checked_in = 1 WHERE token = ?").run(req.params.token);
  queue.gate = Math.max(0, queue.gate - 1);
  res.json({ ok: true });
});

app.get("/api/v1/queue", (_req, res) => res.json(queue));

app.get("/api/v1/queue/analytics", (_req, res) => {
  const dining = db.prepare("SELECT name, capacity, wait FROM dining_halls").all();
  const passes = db.prepare("SELECT COUNT(*) as c FROM passes").get().c;
  const checked = db.prepare("SELECT COUNT(*) as c FROM passes WHERE checked_in = 1").get().c;
  res.json({
    live_queues: queue,
    dining,
    passes_issued: passes,
    checkin_rate: passes ? Math.round((100 * checked) / passes) : 0,
    avg_wait_minutes: dining.reduce((s, d) => s + d.wait, 0) / (dining.length || 1),
    sms_enabled: Boolean(process.env.TWILIO_ACCOUNT_SID),
  });
});
app.get("/api/v1/queue/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  const tick = () => res.write(`data: ${JSON.stringify({ ...queue, ts: new Date().toISOString() })}\n\n`);
  tick();
  const id = setInterval(tick, 2000);
  req.on("close", () => clearInterval(id));
});
app.post("/api/v1/queue/tick", (req, res) => {
  const line = req.query.line ?? "food";
  if (line === "food" && queue.food > 0) queue.food -= 1;
  if (line === "gate" && queue.gate > 0) queue.gate -= 1;
  res.json(queue);
});

const port = process.env.PORT ?? 8014;
app.listen(port, () => console.log(`CampusOS API on ${port}`));
