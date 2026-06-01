"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/data-table";
import { StatusBadge } from "@/components/data/status-badge";
import { formatDate } from "@/lib/utils";
import type { ManagedUser } from "@/types/domain";
import type { ServerPaginationState } from "@/hooks/use-server-pagination";
import { useDeleteUser } from "../hooks/use-users";
import { UserEditDialog } from "./user-edit-dialog";

interface UserTableProps {
  data: ManagedUser[];
  isLoading?: boolean;
  isRefetching?: boolean;
  serverPagination?: ServerPaginationState & { onPageChange: (page: number) => void };
}

export function UserTable({ data, isLoading, isRefetching, serverPagination }: UserTableProps) {
  const remove = useDeleteUser();
  const [editUser, setEditUser] = useState<ManagedUser | null>(null);

  const columns: ColumnDef<ManagedUser>[] = [
    { accessorKey: "email", header: "Email" },
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((role) => (
            <StatusBadge key={role} value={role} />
          ))}
        </div>
      )
    },
    {
      accessorKey: "enabled",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge value={row.original.accountLocked ? "LOCKED" : row.original.enabled} />
      )
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last login",
      cell: ({ row }) => (row.original.lastLoginAt ? formatDate(row.original.lastLoginAt) : "—")
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditUser(row.original)}>
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={remove.isPending}
            onClick={() => {
              if (window.confirm(`Deactivate ${row.original.email}?`)) {
                remove.mutate(row.original.id);
              }
            }}
          >
            <UserX className="mr-1 h-3.5 w-3.5" />
            Deactivate
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
        serverPagination={serverPagination}
        searchPlaceholder="Search users by email or name..."
      />
      <UserEditDialog
        user={editUser}
        open={Boolean(editUser)}
        onOpenChange={(open) => !open && setEditUser(null)}
      />
    </>
  );
}
