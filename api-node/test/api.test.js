// Run with: npm test  (node:test; boots the real server on a throwaway port + temp data dir)
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 18014;
const base = `http://127.0.0.1:${PORT}/api/v1`;
let proc;
let tmp;

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "campusos-"));
  proc = spawn(process.execPath, [path.join(root, "src", "server.js")], {
    env: { ...process.env, PORT: String(PORT), DATA_DIR: tmp },
    stdio: "ignore",
  });
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(`${base}/health`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("API did not start");
});

after(() => proc?.kill());

test("health", async () => {
  const body = await (await fetch(`${base}/health`)).json();
  assert.equal(body.status, "ok");
});

test("seeded events and command overview", async () => {
  const events = await (await fetch(`${base}/events`)).json();
  assert.ok(Array.isArray(events) && events.length > 0);
  assert.equal((await fetch(`${base}/command/overview`)).status, 200);
});

test("register for event, fetch QR, check in", async () => {
  const [event] = await (await fetch(`${base}/events`)).json();
  const reg = await (
    await fetch(`${base}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: event.id, email: "student@example.edu" }),
    })
  ).json();
  assert.ok(reg.token);
  const qr = await fetch(`${base}/qr/${reg.token}`);
  assert.equal(qr.headers.get("content-type"), "image/png");
  const ok = await fetch(`${base}/checkin/${reg.token}`, { method: "POST" });
  assert.equal(ok.status, 200);
  assert.equal((await fetch(`${base}/checkin/bogus`, { method: "POST" })).status, 404);
});
