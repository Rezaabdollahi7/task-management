// src/context/SocketContext.jsx
// WebSocket connection management

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) {
      // Disconnect if logged out
      if (socket) {
        console.log("🔌 Disconnecting socket (user logged out)");
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Create socket connection
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://188.213.199.116';

    console.log("🔌 Connecting to:", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
path: '/socket.io', 
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"], // ← اضافه کن
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setConnected(true);

      // Authenticate with JWT token
      const token = localStorage.getItem("token");
      if (token) {
        console.log("🔑 Authenticating with token...");
        newSocket.emit("authenticate", token);
      } else {
        console.error("❌ No token found in localStorage");
      }
    });

    newSocket.on("authenticated", (data) => {
      if (data.success) {
        console.log("✅ Socket authenticated successfully");
      } else {
        console.error("❌ Socket authentication failed:", data.error);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("Full error:", error);
      setConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setConnected(true);
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Reconnection attempt #", attemptNumber);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after all attempts");
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, [user]);

  const value = {
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
