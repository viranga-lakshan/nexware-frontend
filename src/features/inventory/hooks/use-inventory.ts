import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { canViewInventoryValuation } from "@/constants/permissions";
import { useAuth } from "@/providers/auth-provider";
import type { PageParams } from "@/types/api";
import { useSessionStore } from "@/store/session-store";
import { inventoryApi, type StockAdjustmentPayload } from "../api/inventory-api";

export function useInventory(params?: PageParams & { warehouseId?: string }) {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: () => inventoryApi.list({ size: 20, sort: "updatedAt,desc", ...params }),
    placeholderData: keepPreviousData
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: () => inventoryApi.lowStock({ size: 10 })
  });
}

export function useInventoryValuation() {
  const { user } = useSessionStore();
  const { isLoading: authLoading } = useAuth();
  const roles = user?.roles ?? [];
  const enabled = !authLoading && canViewInventoryValuation(roles);

  return useQuery({
    queryKey: ["inventory", "valuation"],
    queryFn: inventoryApi.valuation,
    enabled,
    retry: false
  });
}

export function useProductStockHistory(productId?: string, params?: PageParams) {
  return useQuery({
    queryKey: ["inventory", "history", "product", productId, params],
    queryFn: () => inventoryApi.productHistory(productId!, { size: 20, ...params }),
    enabled: Boolean(productId)
  });
}

export function useWarehouseStockHistory(warehouseId?: string, params?: PageParams) {
  return useQuery({
    queryKey: ["inventory", "history", "warehouse", warehouseId, params],
    queryFn: () => inventoryApi.warehouseHistory(warehouseId!, { size: 20, ...params }),
    enabled: Boolean(warehouseId)
  });
}

export function useStockAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StockAdjustmentPayload) => inventoryApi.adjust(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Stock adjusted successfully");
    }
  });
}
