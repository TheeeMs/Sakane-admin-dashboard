/**
 * Local persistence for announcement visual customization (background color,
 * cover image data URL). The backend DTO does not currently store these
 * fields, so we persist them client-side keyed by the announcement id, and
 * apply them when mapping API items into the UI model.
 *
 * Storage format:
 *   localStorage["sakane.announcement.visuals"] = {
 *     [announcementId]: { bgColor?: string; image?: string }
 *   }
 */

const STORAGE_KEY = "sakane.announcement.visuals";

export type AnnouncementVisual = {
  bgColor?: string | null;
  image?: string | null;
};

type Store = Record<string, AnnouncementVisual>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota exceeded — ignore silently
  }
}

export function getVisual(id: string): AnnouncementVisual | undefined {
  if (!id) return undefined;
  return readStore()[id];
}

export function setVisual(id: string, visual: AnnouncementVisual): void {
  if (!id) return;
  const store = readStore();
  store[id] = { ...store[id], ...visual };
  writeStore(store);
}

export function clearVisual(id: string): void {
  if (!id) return;
  const store = readStore();
  if (id in store) {
    delete store[id];
    writeStore(store);
  }
}

/**
 * After the backend creates a new announcement, the only hook we have is the
 * subsequent list refresh. Buffer the just-created visual under a temporary
 * key keyed by title+timestamp so it can be applied to the new item that
 * appears at the top of the next refresh.
 */
const PENDING_KEY = "sakane.announcement.visuals.pending";

export type PendingVisual = AnnouncementVisual & {
  title: string;
  createdAt: number;
};

export function setPendingVisual(visual: PendingVisual): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(visual));
  } catch {
    // ignore
  }
}

export function consumePendingVisualForTitle(
  title: string,
): AnnouncementVisual | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return undefined;
    const pending = JSON.parse(raw) as PendingVisual;
    if (!pending || pending.title !== title) return undefined;
    // expire after 60s to avoid stale matches
    if (Date.now() - pending.createdAt > 60_000) {
      window.localStorage.removeItem(PENDING_KEY);
      return undefined;
    }
    window.localStorage.removeItem(PENDING_KEY);
    return { bgColor: pending.bgColor, image: pending.image };
  } catch {
    return undefined;
  }
}
