// src/lib/alertService.ts

import { apiFetch } from "./authService";

const BASE_URL = "/v1/alerts";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AlertType     = "MISSING" | "EMERGENCY" | "FOUND" | string;
export type AlertCategory = "PET" | "PERSON" | "ITEM" | string;
export type AlertStatus   = "OPEN" | "RESOLVED" | "CLOSED" | string;

export interface AlertAPI {
  id: string;
  reporterId: string;
  type: AlertType;
  category: AlertCategory;
  title: string;
  description: string;
  location: string;
  eventTime: string;
  photoUrls: string[];
  contactNumber: string;
  status: AlertStatus;
  isResolved: boolean;
  resolvedAt: string | null;
}

export interface CreateAlertDTO {
  reporterId: string;
  type: AlertType;
  category: AlertCategory;
  title: string;
  description: string;
  location: string;
  eventTime: string;
  photoUrls: string[];
  contactNumber: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

// GET /v1/alerts
export async function fetchAlerts(): Promise<AlertAPI[]> {
  const res = await apiFetch(BASE_URL);
  if (!res.ok) throw new Error(`Failed to fetch alerts (${res.status})`);
  return res.json();
}

// GET /v1/alerts/{id}
export async function fetchAlertById(id: string): Promise<AlertAPI> {
  const res = await apiFetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch alert (${res.status})`);
  return res.json();
}

// POST /v1/alerts
export async function createAlert(dto: CreateAlertDTO): Promise<string> {
  const res = await apiFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`Failed to create alert (${res.status})`);
  return res.json();
}

// PATCH /v1/alerts/{id}/resolve
export async function resolveAlert(id: string, requestingUserId: string): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/${id}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ requestingUserId }),
  });
  if (!res.ok) throw new Error(`Failed to resolve alert (${res.status})`);
}