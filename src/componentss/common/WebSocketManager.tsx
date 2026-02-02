import { useEffect } from 'react';
import { useAuthStore } from '../../context/useAuthStore';
import { useWebSocketStore } from '../../context/useWebSocketStore';

export const WebSocketManager = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { connect, disconnect } = useWebSocketStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => disconnect();
  }, [isAuthenticated, user, connect, disconnect]);

  return null; // This component renders nothing, it just manages the connection
};