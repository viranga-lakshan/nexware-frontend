import { apiClient, unwrap } from "@/services/api-client";
import type { PageParams, PageResponse } from "@/types/api";
import type { Notification } from "@/types/domain";

export const notificationApi = {
  list: (params?: PageParams) =>
    unwrap<PageResponse<Notification>>(apiClient.get("/notifications", { params }))
};
