/**
 * Push tab API helpers + global interceptor that guarantees the Push
 * tab uses its own dedicated endpoint variant.
 *
 * Why an interceptor: the parent (`Announcements.tsx`) calls
 * `communicationsApi.createPushNotification` for the Push tab, which
 * POSTs to `/v1/admin/communications/notifications` WITHOUT a tab
 * parameter. The backend then routes the new record by its internal
 * `source` field, which can place items with `priority=HIGH` under the
 * System tab by mistake.
 *
 * Importing this module installs an axios request interceptor that
 * adds `?tab=PUSH_NOTIFICATIONS` to every POST request targeting the
 * shared notifications endpoint that doesn't already carry a tab. The
 * System tab uses an explicit `tab=SYSTEM_NOTIFICATIONS` (see
 * `SystemNotifications/systemApi.ts`) so it bypasses this default.
 *
 * The interceptor is installed exactly once per page load.
 */

import { httpClient } from "@/lib/api/httpClient";

const NOTIF_PATH = "/v1/admin/communications/notifications";

declare global {
  interface Window {
    __sakanePushTabInterceptorInstalled?: boolean;
  }
}

function installInterceptorOnce(): void {
  if (typeof window === "undefined") return;
  if (window.__sakanePushTabInterceptorInstalled) return;
  window.__sakanePushTabInterceptorInstalled = true;

  httpClient.interceptors.request.use((config) => {
    const method = (config.method || "").toLowerCase();
    const url = config.url || "";

    // Only target POSTs to the shared notifications endpoint
    // (and only when the path itself, not a sub-resource, matches).
    if (method !== "post") return config;
    const stripped = url.split("?")[0];
    if (
      stripped !== NOTIF_PATH &&
      stripped !== NOTIF_PATH + "/" &&
      stripped !== "/" + NOTIF_PATH.replace(/^\//, "")
    )
      return config;

    // Don't override an explicit tab passed by the caller.
    const params = (config.params ?? {}) as Record<string, unknown>;
    if (params.tab) return config;
    if (/[?&]tab=/.test(url)) return config;

    config.params = { ...params, tab: "PUSH_NOTIFICATIONS" };
    return config;
  });
}

installInterceptorOnce();

export const pushApi = {
  /** Re-export of the path for callers that want to build their own POST. */
  endpoint: NOTIF_PATH,
};
