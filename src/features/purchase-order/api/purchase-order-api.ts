import { apiClient, unwrap } from "@/services/api-client";
import type { PageParams, PageResponse } from "@/types/api";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/domain";

export const purchaseOrderApi = {
  list: (params?: PageParams & { status?: PurchaseOrderStatus }) =>
    unwrap<PageResponse<PurchaseOrder>>(apiClient.get("/purchase-orders", { params })),
  create: (payload: unknown) => unwrap<PurchaseOrder>(apiClient.post("/purchase-orders", payload)),
  approve: (id: string) => unwrap<PurchaseOrder>(apiClient.patch(`/purchase-orders/${id}/approve`)),
  reject: (id: string, reason: string) =>
    unwrap<PurchaseOrder>(apiClient.patch(`/purchase-orders/${id}/reject`, { reason })),
  receive: (id: string, warehouseId: string) =>
    unwrap<PurchaseOrder>(apiClient.patch(`/purchase-orders/${id}/receive`, { warehouseId }))
};
