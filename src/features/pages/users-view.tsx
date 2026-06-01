"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { UserTable } from "@/features/user/components/user-table";
import { useUsers } from "@/features/user/hooks/use-users";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useAuth } from "@/providers/auth-provider";
import { ASSIGNABLE_ROLES, type RoleName } from "@/types/domain";

export function UsersView() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(["ADMIN"]);
  const pagination = useServerPagination(20);
  const [roleFilter, setRoleFilter] = useState<RoleName | "">("");

  const users = useUsers({
    ...pagination.params,
    ...(roleFilter ? { role: roleFilter } : {})
  });

  if (!isAdmin) {
    return (
      <AppShell>
        <PageHeader title="Users" description="Administrator access required." />
        <p className="text-sm text-muted-foreground">You do not have permission to manage users.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Users"
        description="Manage operator accounts, roles, and access. New sign-ups via Register start as Inventory Staff — assign roles here."
        action={
          <Button
            variant="outline"
            onClick={() => {
              void navigator.clipboard.writeText(`${window.location.origin}/register`);
              toast.success("Registration link copied — share with new users");
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Copy register link
          </Button>
        }
      />
      <div className="mb-4 max-w-xs">
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as RoleName | "")}>
          <option value="">All roles</option>
          {ASSIGNABLE_ROLES.map((role) => (
            <option key={role} value={role}>
              {role.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
      </div>
      {users.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <UserTable
          data={users.data?.content ?? []}
          isRefetching={users.isFetching && !users.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(users.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
