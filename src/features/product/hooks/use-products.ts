import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PageParams } from "@/types/api";
import { productApi } from "../api/product-api";

export function useProducts(params?: PageParams & { categoryId?: string; keyword?: string }) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.list({ size: 20, sort: "name", ...params }),
    placeholderData: keepPreviousData
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: productApi.categories
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    }
  });
}
