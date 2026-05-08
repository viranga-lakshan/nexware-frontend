import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PageParams } from "@/types/api";
import { warehouseApi } from "../api/warehouse-api";

export function useWarehouses(params?: PageParams) {
  return useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => warehouseApi.list({ size: 20, sort: "name", ...params }),
    placeholderData: keepPreviousData
  });
}

export function useWarehouseTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: warehouseApi.transfer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
      void queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse transfer completed");
    }
  });
}
