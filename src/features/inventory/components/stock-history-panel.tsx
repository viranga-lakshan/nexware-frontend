"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data/data-table";
import { ProductSelect, WarehouseSelect } from "@/components/forms/entity-selects";
import { formatDate } from "@/lib/utils";
import type { StockMovement } from "@/types/domain";
import { useProductStockHistory, useWarehouseStockHistory } from "../hooks/use-inventory";
import { useServerPagination } from "@/hooks/use-server-pagination";

const columns: ColumnDef<StockMovement>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "movementType", header: "Type" },
  { accessorKey: "quantity", header: "Qty" },
  { accessorKey: "reason", header: "Reason" },
  {
    accessorKey: "occurredAt",
    header: "Occurred",
    cell: ({ row }) => formatDate(row.original.occurredAt)
  }
];

export function StockHistoryPanel() {
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const productPagination = useServerPagination(10);
  const warehousePagination = useServerPagination(10);

  const productHistory = useProductStockHistory(productId || undefined, productPagination.params);
  const warehouseHistory = useWarehouseStockHistory(warehouseId || undefined, warehousePagination.params);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Product movement history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductSelect
            value={productId}
            onChange={(value) => {
              setProductId(value);
              setWarehouseId("");
              productPagination.resetPage();
            }}
          />
          {productId ? (
            <DataTable
              columns={columns}
              data={productHistory.data?.content ?? []}
              isLoading={productHistory.isLoading}
              serverPagination={{
                ...productPagination.applyPageResponse(productHistory.data),
                onPageChange: productPagination.setPage
              }}
              searchPlaceholder="Filter movements..."
            />
          ) : (
            <p className="text-sm text-muted-foreground">Select a product to view stock movements.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse movement history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WarehouseSelect
            value={warehouseId}
            onChange={(value) => {
              setWarehouseId(value);
              setProductId("");
              warehousePagination.resetPage();
            }}
          />
          {warehouseId ? (
            <DataTable
              columns={columns}
              data={warehouseHistory.data?.content ?? []}
              isLoading={warehouseHistory.isLoading}
              serverPagination={{
                ...warehousePagination.applyPageResponse(warehouseHistory.data),
                onPageChange: warehousePagination.setPage
              }}
              searchPlaceholder="Filter movements..."
            />
          ) : (
            <p className="text-sm text-muted-foreground">Select a warehouse to view stock movements.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
