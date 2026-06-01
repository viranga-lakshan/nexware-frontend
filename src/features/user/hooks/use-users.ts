import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PageParams } from "@/types/api";
import type { RoleName } from "@/types/domain";
import { userApi, type UserUpdatePayload } from "../api/user-api";

export function useUsers(params?: PageParams & { keyword?: string; role?: RoleName; enabled?: boolean }) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.list({ size: 20, sort: "email", ...params }),
    placeholderData: keepPreviousData
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) => userApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated");
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deactivated");
    }
  });
}
