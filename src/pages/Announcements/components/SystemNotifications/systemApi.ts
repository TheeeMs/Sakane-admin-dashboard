/**
 * System tab API helpers — every call carries an explicit
 * `tab=SYSTEM_NOTIFICATIONS` query parameter so the backend can route
 * the record correctly and so the Push tab's default-tab interceptor
 * (see `PushNotifications/pushApi.ts`) does not override it.
 */

import { httpClient } from "@/lib/api/httpClient";

const NOTIF_PATH = "/v1/admin/communications/notifications";
const SYSTEM_TAB = "SYSTEM_NOTIFICATIONS";

export type CreateSystemTemplatePayload = {
  title: string;
  message: string;
  priority?: string;
  scheduleAt?: string | null;
  /** marker that the backend can use to disambiguate, in case it does
   *  not yet honour the `tab` query string. */
  source?: string;
  sendToAll?: boolean;
};

export const systemApi = {
  createTemplate(payload: CreateSystemTemplatePayload) {
    return httpClient.post(
      NOTIF_PATH,
      { source: "SYSTEM", ...payload },
      { params: { tab: SYSTEM_TAB } },
    );
  },

  updateTemplate(
    itemId: string,
    payload: { title?: string; message?: string; priority?: string },
  ) {
    return httpClient.patch(`${NOTIF_PATH}/${itemId}`, payload, {
      params: { tab: SYSTEM_TAB },
    });
  },

  deleteTemplate(itemId: string) {
    return httpClient.delete(`${NOTIF_PATH}/${itemId}`, {
      params: { tab: SYSTEM_TAB },
    });
  },
};
