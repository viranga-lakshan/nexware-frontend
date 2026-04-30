"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";

const columns: ColumnDef<Product>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "name", header: "Product" },
  { accessorKey: "brand", header: "Brand" },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => (
      <span className="rounded bg-muted px-2 py-1 font-mono text-xs">{row.original.barcode || "—"}</span>
    )
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "—"
  },
  {
    id: "suppliers",
    header: "Suppliers",
    cell: ({ row }) =>
      row.original.suppliers?.map((s) => s.displayName).join(", ") || "—"
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => formatCurrency(row.original.unitPrice)
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.active} />
  }
];

interface ProductTableProps {
  data: Product[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function ProductTable({ data, isLoading, isRefetching, serverPagination }: ProductTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableRowSelection
      serverPagination={serverPagination}
      searchPlaceholder="Search SKU, barcode, product, brand..."
    />
  );
}
