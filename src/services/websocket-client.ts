import { getWebSocketUrl, isRealtimeEnabled } from "@/lib/realtime-config";

type MessageHandler<T = unknown> = (payload: T) => void;

class NexwareSocket {
  private socket?: WebSocket;
  private handlers = new Set<MessageHandler>();
  private connectAttempted = false;

  connect() {
    if (typeof window === "undefined" || !isRealtimeEnabled()) return;

    const url = getWebSocketUrl();
    if (!url) return;

    if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.connectAttempted = true;

    try {
      this.socket = new WebSocket(url);
    } catch {
      return;
    }

    this.socket.onmessage = (event) => {
      const payload = safeParse(event.data);
      this.handlers.forEach((handler) => handler(payload));
    };

    // Avoid noisy console errors when backend has no WebSocket endpoint yet.
    this.socket.onerror = () => {
      this.socket?.close();
    };

    this.socket.onclose = () => {
      this.socket = undefined;
    };
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);

    if (isRealtimeEnabled()) {
      this.connect();
    }

    return () => {
      this.handlers.delete(handler);
      if (this.handlers.size === 0) {
        this.disconnect();
      }
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = undefined;
    this.connectAttempted = false;
  }

  get enabled() {
    return isRealtimeEnabled();
  }

  get attempted() {
    return this.connectAttempted;
  }
}

function safeParse(data: string) {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

export const nexwareSocket = new NexwareSocket();
