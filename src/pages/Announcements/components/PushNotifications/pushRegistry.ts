/**
 * Cross-tab classification registry — Push side.
 * Mirrors the same localStorage keys used by SystemNotifications/templateStore.
 *
 *   sakane.notif.pushIds   — ids ever seen on the Push tab
 *   sakane.notif.systemIds — ids ever seen as System
 *
 * The first tab to claim an id wins. This keeps notifications from
 * appearing in both tabs at once when the backend's tab routing flips.
 */

const PUSH_IDS_KEY = "sakane.notif.pushIds";
const SYSTEM_IDS_KEY = "sakane.notif.systemIds";

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
    // ignore quota errors
  }
}

export function registerPushIds(ids: string[]): boolean {
  if (!ids.length) return false;
  const sysSet = readSet(SYSTEM_IDS_KEY);
  const set = readSet(PUSH_IDS_KEY);
  let changed = false;
  for (const id of ids) {
    // First-seen wins: if System already owns this id, don't claim it.
    if (id && !sysSet.has(id) && !set.has(id)) {
      set.add(id);
      changed = true;
    }
  }
  if (changed) writeSet(PUSH_IDS_KEY, set);
  return changed;
}

export function unregisterPushId(id: string): void {
  if (!id) return;
  const set = readSet(PUSH_IDS_KEY);
  if (set.delete(id)) writeSet(PUSH_IDS_KEY, set);
}

export function isKnownPushId(id: string): boolean {
  if (!id) return false;
  return readSet(PUSH_IDS_KEY).has(id);
}

export function isKnownSystemId(id: string): boolean {
  if (!id) return false;
  return readSet(SYSTEM_IDS_KEY).has(id);
}
