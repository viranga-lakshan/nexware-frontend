"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseOrderCreateDialog } from "@/features/purchase-order/components/purchase-order-create-dialog";
import { PurchaseOrderTable } from "@/features/purchase-order/components/purchase-order-table";
import { usePurchaseOrders } from "@/features/purchase-order/hooks/use-purchase-orders";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useAuth } from "@/providers/auth-provider";

export function PurchaseOrdersView() {
  const pagination = useServerPagination(20);
  const purchaseOrders = usePurchaseOrders(pagination.params);
  const { hasRole } = useAuth();

  return (
    <AppShell>
      <PageHeader
        title="Purchase Orders"
        description="Draft, approve, reject, and receive purchase orders through the backend workflow."
        action={hasRole(["ADMIN", "PROCUREMENT_OFFICER"]) ? <PurchaseOrderCreateDialog /> : undefined}
      />
      {purchaseOrders.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <PurchaseOrderTable
          data={purchaseOrders.data?.content ?? []}
          isRefetching={purchaseOrders.isFetching && !purchaseOrders.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(purchaseOrders.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
