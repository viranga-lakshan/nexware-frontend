"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { nexwareSocket } from "@/services/websocket-client";
import { isRealtimeEnabled } from "@/lib/realtime-config";

interface RealtimePayload {
  type?: string;
  message?: string;
  title?: string;
}

/** Subscribes to WebSocket events and refreshes server state when inventory changes. */
export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isRealtimeEnabled()) return;

    const unsubscribe = nexwareSocket.subscribe((payload) => {
      const event = payload as RealtimePayload;
      const type = event?.type?.toUpperCase() ?? "";

      if (type.includes("INVENTORY") || type.includes("STOCK") || type.includes("RESERVATION")) {
        void queryClient.invalidateQueries({ queryKey: ["inventory"] });
        void queryClient.invalidateQueries({ queryKey: ["reservations"] });
        void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }

      if (type.includes("PURCHASE") || type.includes("ORDER")) {
        void queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      }

      if (type.includes("NOTIFICATION") || type.includes("LOW_STOCK")) {
        void queryClient.invalidateQueries({ queryKey: ["notifications"] });
        if (event.title || event.message) {
          toast.info(event.title ?? "Notification", { description: event.message });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
}
