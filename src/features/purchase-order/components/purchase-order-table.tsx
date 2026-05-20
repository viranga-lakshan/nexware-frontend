"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { PurchaseOrder } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";
import { usePurchaseOrderAction } from "../hooks/use-purchase-orders";
import { ReceivePurchaseOrderDialog } from "./receive-purchase-order-dialog";

interface PurchaseOrderTableProps {
  data: PurchaseOrder[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function PurchaseOrderTable({ data, isLoading, isRefetching, serverPagination }: PurchaseOrderTableProps) {
  const actions = usePurchaseOrderAction();
  const [receiveTarget, setReceiveTarget] = useState<PurchaseOrder | null>(null);

  const columns: ColumnDef<PurchaseOrder>[] = [
    { accessorKey: "orderNumber", header: "Order" },
    { accessorKey: "supplierName", header: "Supplier" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge value={row.original.status} />
    },
    {
      accessorKey: "grandTotal",
      header: "Total",
      cell: ({ row }) => formatCurrency(row.original.grandTotal)
    },
    { accessorKey: "expectedDeliveryDate", header: "Expected" },
    {
      id: "actions",
      header: "Workflow",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={row.original.status !== "DRAFT" || actions.approve.isPending}
            onClick={() => actions.approve.mutate(row.original.id)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={row.original.status !== "DRAFT" || actions.reject.isPending}
            onClick={() =>
              actions.reject.mutate({ id: row.original.id, reason: "Rejected from procurement workflow" })
            }
          >
            Reject
          </Button>
          <Button
            size="sm"
            disabled={row.original.status !== "APPROVED"}
            onClick={() => setReceiveTarget(row.original)}
          >
            Receive
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isRefetching={isRefetching}
        enableRowSelection
        serverPagination={serverPagination}
        searchPlaceholder="Search purchase orders..."
      />
      <ReceivePurchaseOrderDialog
        orderId={receiveTarget?.id ?? null}
        orderNumber={receiveTarget?.orderNumber}
        open={Boolean(receiveTarget)}
        onOpenChange={(open) => !open && setReceiveTarget(null)}
        isLoading={actions.receive.isPending}
        onConfirm={(warehouseId) => {
          if (!receiveTarget) return;
          actions.receive.mutate(
            { id: receiveTarget.id, warehouseId },
            { onSuccess: () => setReceiveTarget(null) }
          );
        }}
      />
    </>
  );
}
