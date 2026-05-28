"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data/data-table";
import { formatDate } from "@/lib/utils";
import type { AuditLog } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";

const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: "action", header: "Action" },
  { accessorKey: "aggregateType", header: "Aggregate" },
  { accessorKey: "actorType", header: "Actor" },
  { accessorKey: "ipAddress", header: "IP" },
  { accessorKey: "requestId", header: "Request ID" },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => formatDate(row.original.createdAt)
  }
];

interface AuditTableProps {
  data: AuditLog[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function AuditTable({ data, isLoading, isRefetching, serverPagination }: AuditTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      enableRowSelection
      serverPagination={serverPagination}
      searchPlaceholder="Search audit logs..."
    />
  );
}
