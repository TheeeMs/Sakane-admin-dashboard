/**
 * Local persistence + cross-tab classification registry.
 *
 *   sakane.system.templates  — locally-saved system templates (full snapshot)
 *   sakane.notif.pushIds     — ids the Push tab has ever seen (cross-tab)
 *   sakane.notif.systemIds   — ids the System tab has ever seen as system
 *
 * Filtering rule applied on the System tab when rendering API items:
 *   - drop ids in pushIds (definitive: the Push tab owns them)
 *   - drop ids that aren't yet in systemIds AND haven't been registered
 *     as belonging to system → the very first time we see an item in
 *     a tab establishes ownership.
 */

import type { PushNotification } from "../../types";

const TEMPLATES_KEY = "sakane.system.templates";
const PUSH_IDS_KEY = "sakane.notif.pushIds";
const SYSTEM_IDS_KEY = "sakane.notif.systemIds";

/* ──────────── templates ──────────── */

function readTemplates(): PushNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PushNotification[]) : [];
  } catch {
    return [];
  }
}

function writeTemplates(items: PushNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export function getLocalTemplates(): PushNotification[] {
  return readTemplates();
}

export function addLocalTemplate(item: PushNotification): void {
  const list = readTemplates();
  const filtered = list.filter((t) => t.id !== item.id);
  writeTemplates([item, ...filtered]);
}

export function removeLocalTemplate(id: string): void {
  if (!id) return;
  const list = readTemplates();
  const next = list.filter((t) => t.id !== id);
  if (next.length !== list.length) writeTemplates(next);
}

/* ──────────── id sets shared between tabs ──────────── */

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {
    // ignore
  }
}

/* push registry */
export function getKnownPushIds(): Set<string> {
  return readSet(PUSH_IDS_KEY);
}
export function isKnownPushId(id: string): boolean {
  if (!id) return false;
  return readSet(PUSH_IDS_KEY).has(id);
}
export function registerPushIds(ids: string[]): void {
  if (!ids.length) return;
  const set = readSet(PUSH_IDS_KEY);
  let changed = false;
  for (const id of ids) {
    if (id && !set.has(id)) {
      set.add(id);
      changed = true;
    }
  }
  if (changed) writeSet(PUSH_IDS_KEY, set);
}
export function unregisterPushId(id: string): void {
  if (!id) return;
  const set = readSet(PUSH_IDS_KEY);
  if (set.delete(id)) writeSet(PUSH_IDS_KEY, set);
}

/* system registry */
export function getKnownSystemIds(): Set<string> {
  return readSet(SYSTEM_IDS_KEY);
}
export function isKnownSystemId(id: string): boolean {
  if (!id) return false;
  return readSet(SYSTEM_IDS_KEY).has(id);
}
export function registerSystemIds(ids: string[]): void {
  if (!ids.length) return;
  const pushSet = readSet(PUSH_IDS_KEY);
  const sysSet = readSet(SYSTEM_IDS_KEY);
  let changed = false;
  for (const id of ids) {
    // Don't claim an id already owned by Push — first-seen wins.
    if (id && !pushSet.has(id) && !sysSet.has(id)) {
      sysSet.add(id);
      changed = true;
    }
  }
  if (changed) writeSet(SYSTEM_IDS_KEY, sysSet);
}
export function unregisterSystemId(id: string): void {
  if (!id) return;
  const set = readSet(SYSTEM_IDS_KEY);
  if (set.delete(id)) writeSet(SYSTEM_IDS_KEY, set);
}
