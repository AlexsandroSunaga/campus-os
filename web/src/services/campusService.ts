import { apiGet } from "@/api/client";

export const campusService = {
  events: () => apiGet<any[]>("/events"),
  queues: () => apiGet<any[]>("/queues", true),
  registrar: () => apiGet<any[]>("/registrar/records", true),
};
