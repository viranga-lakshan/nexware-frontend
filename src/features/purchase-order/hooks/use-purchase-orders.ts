import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PageParams, PageResponse } from "@/types/api";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/domain";
import { purchaseOrderApi } from "../api/purchase-order-api";

export function usePurchaseOrders(params?: PageParams & { status?: PurchaseOrderStatus }) {
  return useQuery({
    queryKey: ["purchase-orders", params],
    queryFn: () => purchaseOrderApi.list({ size: 20, sort: "createdAt,desc", ...params }),
    placeholderData: keepPreviousData
  });
}

export function usePurchaseOrderAction() {
  const queryClient = useQueryClient();

  const updateCache = (id: string, updater: (order: PurchaseOrder) => PurchaseOrder) => {
    queryClient.setQueriesData<PageResponse<PurchaseOrder>>({ queryKey: ["purchase-orders"] }, (old) => {
      if (!old) return old;
      return {
        ...old,
        content: old.content.map((order) => (order.id === id ? updater(order) : order))
      };
    });
  };

  const approve = useMutation({
    mutationFn: purchaseOrderApi.approve,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["purchase-orders"] });
      updateCache(id, (order) => ({ ...order, status: "APPROVED" }));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase order approved");
    },
    onError: () => void queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => purchaseOrderApi.reject(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase order rejected");
    }
  });

  const receive = useMutation({
    mutationFn: ({ id, warehouseId }: { id: string; warehouseId: string }) =>
      purchaseOrderApi.receive(id, warehouseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Purchase order received");
    }
  });

  return { approve, reject, receive };
}
