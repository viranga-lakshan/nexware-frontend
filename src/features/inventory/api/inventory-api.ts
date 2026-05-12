import { apiClient, unwrap } from "@/services/api-client";
import type { PageParams, PageResponse } from "@/types/api";
import type { InventoryItem, InventoryValuation, StockMovement } from "@/types/domain";

export interface StockAdjustmentPayload {
  warehouseId: string;
  productId: string;
  locationId?: string;
  newQuantityOnHand: number;
  unitCost?: number;
  reason: string;
}

export const inventoryApi = {
  list: (params?: PageParams & { warehouseId?: string; keyword?: string }) =>
    unwrap<PageResponse<InventoryItem>>(apiClient.get("/inventory", { params })),
  lowStock: (params?: PageParams) =>
    unwrap<PageResponse<InventoryItem>>(apiClient.get("/inventory/low-stock", { params })),
  valuation: () => unwrap<InventoryValuation>(apiClient.get("/inventory/valuation")),
  adjust: (payload: StockAdjustmentPayload) =>
    unwrap<InventoryItem>(apiClient.patch("/inventory/adjustments", payload)),
  productHistory: (productId: string, params?: PageParams) =>
    unwrap<PageResponse<StockMovement>>(apiClient.get(`/inventory/products/${productId}/history`, { params })),
  warehouseHistory: (warehouseId: string, params?: PageParams) =>
    unwrap<PageResponse<StockMovement>>(apiClient.get(`/inventory/warehouses/${warehouseId}/history`, { params }))
};
