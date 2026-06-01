import { apiClient, unwrap } from "@/services/api-client";
import type { PageResponse } from "@/types/api";
import type { ManagedUser, RoleName } from "@/types/domain";

export interface UserUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  enabled?: boolean;
  accountLocked?: boolean;
  roles?: RoleName[];
}

export const userApi = {
  list: (params?: Record<string, unknown>) =>
    unwrap<PageResponse<ManagedUser>>(apiClient.get("/users", { params })),
  get: (id: string) => unwrap<ManagedUser>(apiClient.get(`/users/${id}`)),
  update: (id: string, payload: UserUpdatePayload) =>
    unwrap<ManagedUser>(apiClient.put(`/users/${id}`, payload)),
  remove: (id: string) => unwrap<void>(apiClient.delete(`/users/${id}`))
};
