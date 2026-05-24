"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationTable } from "@/features/notification/components/notification-table";
import { useNotifications } from "@/features/notification/hooks/use-notifications";
import { useServerPagination } from "@/hooks/use-server-pagination";

export function NotificationsView() {
  const pagination = useServerPagination(20);
  const notifications = useNotifications(pagination.params);

  return (
    <AppShell>
      <PageHeader
        title="Notifications"
        description="Operational alerts including low stock, reservations, and procurement events."
      />
      {notifications.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <NotificationTable
          data={notifications.data?.content ?? []}
          isRefetching={notifications.isFetching && !notifications.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(notifications.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
