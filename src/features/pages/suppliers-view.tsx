"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { SupplierCreateDialog } from "@/features/supplier/components/supplier-create-dialog";
import { SupplierTable } from "@/features/supplier/components/supplier-table";
import { useSuppliers } from "@/features/supplier/hooks/use-suppliers";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useAuth } from "@/providers/auth-provider";

export function SuppliersView() {
  const pagination = useServerPagination(20);
  const suppliers = useSuppliers(pagination.params);
  const { hasRole } = useAuth();

  return (
    <AppShell>
      <PageHeader
        title="Suppliers"
        description="Supplier management and procurement relationship visibility."
        action={hasRole(["ADMIN", "PROCUREMENT_OFFICER"]) ? <SupplierCreateDialog /> : undefined}
      />
      {suppliers.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <SupplierTable
          data={suppliers.data?.content ?? []}
          isRefetching={suppliers.isFetching && !suppliers.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(suppliers.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
