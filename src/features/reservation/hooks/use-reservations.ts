import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PageParams } from "@/types/api";
import { reservationApi } from "../api/reservation-api";

export function useReservations(params?: PageParams & { warehouseId?: string }) {
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: () => reservationApi.list({ size: 20, sort: "expiresAt", ...params }),
    placeholderData: keepPreviousData
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservationApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reservations"] });
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Reservation created");
    }
  });
}

export function useReleaseReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reservationApi.release,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["reservations"] });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reservations"] });
      void queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Reservation released");
    }
  });
}
