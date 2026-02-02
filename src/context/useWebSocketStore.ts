import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface WebSocketState {
  stompClient: Client | null;
  isConnected: boolean;

  // Actions
  connect: () => void;
  disconnect: () => void;
  subscribe: (topic: string, callback: (msg: any) => void) => any;
  send: (destination: string, payload: any) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  stompClient: null,
  isConnected: false,

  connect: () => {
    // Prevent multiple connections
    if (get().stompClient?.active) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(API_BASE_URL + '/ws-game'),
      onConnect: () => {
        console.log('STOMP: Connected');
        set({ isConnected: true });
      },
      onDisconnect: () => {
        console.log('STOMP: Disconnected');
        set({ isConnected: false });
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // Auto-reconnect every 5 seconds if server drops
    });

    client.activate();
    set({ stompClient: client });
  },

  disconnect: () => {
    const { stompClient } = get();
    if (stompClient) {
      stompClient.deactivate();
      set({ stompClient: null, isConnected: false });
    }
  },

  subscribe: (topic, callback) => {
    const { stompClient, isConnected } = get();
    if (stompClient && isConnected) {
      // Return the subscription object!
      return stompClient.subscribe(topic, (message: IMessage) => {
        callback(JSON.parse(message.body));
      });
    }
    return null;
  },

  send: (destination, payload) => {
    const { stompClient, isConnected } = get();
    if (stompClient && isConnected) {
      stompClient.publish({
        destination: `/app${destination}`,
        body: JSON.stringify(payload),
      });
    } else {
      console.error("STOMP: Cannot send message, not connected.");
    }
  },
}));