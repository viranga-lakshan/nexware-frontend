"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InventoryItem } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";

const columns: ColumnDef<InventoryItem>[] = [
  { accessorKey: "warehouseCode", header: "Warehouse" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "productName", header: "Product" },
  { accessorKey: "quantityOnHand", header: "On Hand" },
  { accessorKey: "quantityReserved", header: "Reserved" },
  { accessorKey: "quantityAvailable", header: "Available" },
  {
    accessorKey: "inventoryValue",
    header: "Value",
    cell: ({ row }) => formatCurrency(row.original.inventoryValue)
  },
  {
    accessorKey: "lowStock",
    header: "Signal",
    cell: ({ row }) =>
      row.original.lowStock ? <StatusBadge value="LOW STOCK" /> : <StatusBadge value="Healthy" />
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => formatDate(row.original.updatedAt)
  }
];

interface InventoryTableProps {
  data: InventoryItem[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function InventoryTable({ data, isLoading, isRefetching, serverPagination }: InventoryTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableRowSelection
      serverPagination={serverPagination}
      searchPlaceholder="Search inventory by SKU, product, warehouse..."
    />
  );
}
