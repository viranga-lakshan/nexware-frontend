"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { InventoryTable } from "@/features/inventory/components/inventory-table";
import { StockAdjustmentForm } from "@/features/inventory/components/stock-adjustment-form";
import { StockHistoryPanel } from "@/features/inventory/components/stock-history-panel";
import { useInventory } from "@/features/inventory/hooks/use-inventory";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useUiStore } from "@/store/ui-store";

export function InventoryView() {
  const { selectedWarehouseId } = useUiStore();
  const pagination = useServerPagination(20);
  const inventory = useInventory({
    ...pagination.params,
    ...(selectedWarehouseId ? { warehouseId: selectedWarehouseId } : {})
  });

  return (
    <AppShell>
      <PageHeader
        title="Inventory"
        description="Track stock on hand, reservations, valuation, adjustments, and movement history."
      />
      <div className="mb-6">
        <StockAdjustmentForm />
      </div>
      {inventory.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <InventoryTable
          data={inventory.data?.content ?? []}
          isRefetching={inventory.isFetching && !inventory.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(inventory.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
      <div className="mt-8">
        <StockHistoryPanel />
      </div>
    </AppShell>
  );
}
