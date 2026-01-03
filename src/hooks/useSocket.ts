import { useEffect, useState, useRef } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { SessionState } from "@/lib/types";

interface UseSocketReturn {
  socket: ReturnType<typeof getSocket> | null;
  sessionState: SessionState | null;
  playerId: string | null;
  error: string | null;
  isConnected: boolean;
}

export function useSocket(sessionId: string | null, playerName: string | null): UseSocketReturn {
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("session-joined", (data: { sessionId: string; playerId: string; state: SessionState }) => {
      setPlayerId(data.playerId);
      setSessionState(data.state);
      setError(null);
    });

    socket.on("session-updated", (data: { state: SessionState }) => {
      setSessionState(data.state);
      setError(null);
    });

    socket.on("error", (data: { message: string }) => {
      setError(data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("session-joined");
      socket.off("session-updated");
      socket.off("error");
    };
  }, [sessionId, playerName]);

  return {
    socket: socketRef.current,
    sessionState,
    playerId,
    error,
    isConnected,
  };
}

