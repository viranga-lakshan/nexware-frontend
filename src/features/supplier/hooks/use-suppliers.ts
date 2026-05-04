import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PageParams } from "@/types/api";
import { supplierApi } from "../api/supplier-api";

export function useSuppliers(params?: PageParams & { keyword?: string }) {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => supplierApi.list({ size: 20, sort: "displayName", ...params }),
    placeholderData: keepPreviousData
  });
}
