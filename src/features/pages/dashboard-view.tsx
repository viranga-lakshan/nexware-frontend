"use client";

import dynamic from "next/dynamic";
import { AlertTriangle, Boxes, Building2, Package, WalletCards } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { canViewInventoryValuation } from "@/constants/permissions";
import { useInventory, useInventoryValuation, useLowStock } from "@/features/inventory/hooks/use-inventory";
import { useProducts } from "@/features/product/hooks/use-products";
import { useWarehouses } from "@/features/warehouse/hooks/use-warehouses";
import { formatCurrency } from "@/lib/utils";
import { useSessionStore } from "@/store/session-store";

const DashboardCharts = dynamic(
  () => import("@/features/analytics/components/dashboard-charts").then((mod) => mod.DashboardCharts),
  { ssr: false }
);

export function DashboardView() {
  const { user } = useSessionStore();
  const roles = user?.roles ?? [];
  const showValuation = canViewInventoryValuation(roles);

  const products = useProducts();
  const inventory = useInventory();
  const lowStock = useLowStock();
  const valuation = useInventoryValuation();
  const warehouses = useWarehouses();

  const inventoryRows = inventory.data?.content ?? [];
  const warehouseRows = warehouses.data?.content ?? [];

  return (
    <AppShell>
      <PageHeader
        title="Operations Dashboard"
        description="Realtime-ready overview for stock health, warehouse capacity, procurement exposure, and reservation risk."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Products"
          value={String(products.data?.totalElements ?? 0)}
          helper="Active catalog items"
          icon={Package}
        />
        {showValuation ? (
          <StatCard
            title="Inventory Value"
            value={formatCurrency(valuation.data?.totalValue)}
            helper="Across warehouses"
            icon={WalletCards}
          />
        ) : (
          <StatCard
            title="Inventory Value"
            value="—"
            helper="Manager / procurement view"
            icon={WalletCards}
          />
        )}
        <StatCard
          title="Warehouses"
          value={String(warehouses.data?.totalElements ?? 0)}
          helper="Distribution locations"
          icon={Building2}
        />
        <StatCard
          title="Low Stock"
          value={String(lowStock.data?.totalElements ?? 0)}
          helper="Needs replenishment"
          icon={AlertTriangle}
        />
      </div>
      <div className="mt-6">
        {inventory.isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <DashboardCharts inventory={inventoryRows} warehouses={warehouseRows} />
        )}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(lowStock.data?.content ?? []).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.warehouseCode} - {item.sku}
                  </p>
                </div>
                <span className="text-sm font-semibold text-destructive">
                  {item.quantityAvailable} available
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventoryRows.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Boxes className="h-4 w-4 text-primary" />
                <p className="text-sm">
                  <span className="font-medium">{item.sku}</span> updated in {item.warehouseCode}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
