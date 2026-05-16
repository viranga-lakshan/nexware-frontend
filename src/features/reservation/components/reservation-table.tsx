"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import { formatDate } from "@/lib/utils";
import type { Reservation } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";
import { useReleaseReservation } from "../hooks/use-reservations";

interface ReservationTableProps {
  data: Reservation[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function ReservationTable({ data, isLoading, isRefetching, serverPagination }: ReservationTableProps) {
  const release = useReleaseReservation();

  const columns: ColumnDef<Reservation>[] = [
    { accessorKey: "reservationReference", header: "Reference" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "quantity", header: "Quantity" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge value={row.original.status} />
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => formatDate(row.original.expiresAt)
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={
            row.original.status !== "ACTIVE" ||
            (release.isPending && release.variables === row.original.id)
          }
          onClick={() => release.mutate(row.original.id)}
        >
          {release.isPending && release.variables === row.original.id ? "Releasing..." : "Release"}
        </Button>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isRefetching={isRefetching}
      serverPagination={serverPagination}
      searchPlaceholder="Search reservations..."
    />
  );
}
