"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { ReservationForm } from "@/features/reservation/components/reservation-form";
import { ReservationTable } from "@/features/reservation/components/reservation-table";
import { useReservations } from "@/features/reservation/hooks/use-reservations";
import { useWarehouses } from "@/features/warehouse/hooks/use-warehouses";
import { useServerPagination } from "@/hooks/use-server-pagination";
import { useUiStore } from "@/store/ui-store";

export function ReservationsView() {
  const { selectedWarehouseId, setSelectedWarehouseId } = useUiStore();
  const warehouses = useWarehouses({ size: 200 });
  const pagination = useServerPagination(20);
  const reservations = useReservations({
    ...pagination.params,
    ...(selectedWarehouseId ? { warehouseId: selectedWarehouseId } : {})
  });

  return (
    <AppShell>
      <PageHeader
        title="Reservations"
        description="Reserve stock, monitor expiration, and release inventory back to available stock."
      />
      <div className="mb-4">
        <Select
          value={selectedWarehouseId ?? ""}
          onChange={(event) => setSelectedWarehouseId(event.target.value || undefined)}
        >
          <option value="">All warehouses</option>
          {(warehouses.data?.content ?? []).map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.code} — {warehouse.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="mb-6">
        <ReservationForm />
      </div>
      {reservations.isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <ReservationTable
          data={reservations.data?.content ?? []}
          isRefetching={reservations.isFetching && !reservations.isLoading}
          serverPagination={{
            ...pagination.applyPageResponse(reservations.data),
            onPageChange: pagination.setPage
          }}
        />
      )}
    </AppShell>
  );
}
