"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { CategorySelect } from "@/components/forms/entity-selects";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCreateDialog } from "@/features/product/components/product-create-dialog";
import { ProductTable } from "@/features/product/components/product-table";
import { useProducts } from "@/features/product/hooks/use-products";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useAuth } from "@/providers/auth-provider";

export function ProductsView() {
  const [categoryId, setCategoryId] = useState("");
  const pagination = useServerPagination(20);
  const { hasRole } = useAuth();
  const canCreate = hasRole(["ADMIN", "PROCUREMENT_OFFICER"]);

  const products = useProducts({
    ...pagination.params,
    ...(categoryId ? { categoryId } : {})
  });

  return (
    <AppShell>
      <PageHeader
        title="Products"
        description="Enterprise catalog with barcode, category, supplier mapping, and server-backed pagination."
        action={canCreate ? <ProductCreateDialog /> : undefined}
      />
      <div className="mb-4 max-w-xs">
        <CategorySelect
          value={categoryId}
          onChange={(value) => {
            setCategoryId(value);
            pagination.resetPage();
          }}
        />
      </div>
      {products.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <ProductTable
          data={products.data?.content ?? []}
          isRefetching={products.isFetching && !products.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(products.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
