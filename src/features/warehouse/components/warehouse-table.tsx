"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import type { Warehouse } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";

const columns: ColumnDef<Warehouse>[] = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "name", header: "Warehouse" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "capacityUnits", header: "Capacity" },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.original.active} />
  }
];

interface WarehouseTableProps {
  data: Warehouse[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function WarehouseTable({ data, isLoading, isRefetching, serverPagination }: WarehouseTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      serverPagination={serverPagination}
      searchPlaceholder="Search warehouses..."
    />
  );
}
