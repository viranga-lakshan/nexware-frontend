import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditApi } from "../api/audit-api";
import type { PageParams } from "@/types/api";

export function useAuditLogs(params?: PageParams) {
  return useQuery({
    queryKey: ["audit", params],
    queryFn: () => auditApi.list({ size: 20, sort: "createdAt,desc", ...params }),
    placeholderData: keepPreviousData
  });
}
