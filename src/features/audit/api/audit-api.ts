import { apiClient, unwrap } from "@/services/api-client";
import type { PageParams, PageResponse } from "@/types/api";
import type { AuditLog } from "@/types/domain";

export const auditApi = {
  list: (params?: PageParams) =>
    unwrap<PageResponse<AuditLog>>(apiClient.get("/audit/logs", { params }))
};
