import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { notificationApi } from "../api/notification-api";
import type { PageParams } from "@/types/api";

export function useNotifications(params?: PageParams) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationApi.list({ size: 20, sort: "createdAt,desc", ...params }),
    placeholderData: keepPreviousData
  });
}
