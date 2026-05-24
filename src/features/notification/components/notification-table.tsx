"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import { formatDate } from "@/lib/utils";
import type { Notification } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";

const columns: ColumnDef<Notification>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "type", header: "Type", cell: ({ row }) => <StatusBadge value={row.original.type} /> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
  { accessorKey: "message", header: "Message" },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt)
  }
];

interface NotificationTableProps {
  data: Notification[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function NotificationTable({ data, isLoading, isRefetching, serverPagination }: NotificationTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      serverPagination={serverPagination}
      searchPlaceholder="Search notifications..."
    />
  );
}
