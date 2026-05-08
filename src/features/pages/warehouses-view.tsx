"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehouseTable } from "@/features/warehouse/components/warehouse-table";
import { WarehouseTransferForm } from "@/features/warehouse/components/warehouse-transfer-form";
import { useWarehouses } from "@/features/warehouse/hooks/use-warehouses";
import { useServerPagination } from "@/hooks/use-server-pagination";

export function WarehousesView() {
  const pagination = useServerPagination(20);
  const warehouses = useWarehouses(pagination.params);

  return (
    <AppShell>
      <PageHeader
        title="Warehouses"
        description="Manage distribution sites, capacity, and operational stock transfers."
      />
      <div className="mb-6">
        <WarehouseTransferForm />
      </div>
      {warehouses.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <WarehouseTable
          data={warehouses.data?.content ?? []}
          isRefetching={warehouses.isFetching && !warehouses.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(warehouses.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
