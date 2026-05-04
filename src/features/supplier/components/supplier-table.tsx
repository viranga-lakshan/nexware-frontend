"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import type { Supplier } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";

const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "displayName", header: "Supplier" },
  { accessorKey: "contactPerson", header: "Contact" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phoneNumber", header: "Phone" },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.active} />
  }
];

interface SupplierTableProps {
  data: Supplier[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function SupplierTable({ data, isLoading, isRefetching, serverPagination }: SupplierTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableRowSelection
      serverPagination={serverPagination}
      searchPlaceholder="Search suppliers..."
    />
  );
}
