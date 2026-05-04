import { apiClient, unwrap } from "@/services/api-client"; import type { PageResponse } from "@/types/api"; import type { Supplier } from "@/types/domain";
export const supplierApi={list:(params?:Record<string,unknown>)=>unwrap<PageResponse<Supplier>>(apiClient.get("/suppliers",{params})),create:(payload:unknown)=>unwrap<Supplier>(apiClient.post("/suppliers",payload))};
