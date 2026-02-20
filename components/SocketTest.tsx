// components/SocketDebug.tsx
import { useSocket, useOnlineUsers } from "@/lib/socket";
import { useEffect } from "react";

export const SocketDebug = () => {
  const socket = useSocket();
  const onlineUsers = useOnlineUsers();

  useEffect(() => {
    if (socket) {
      // console.log("🔌 Socket ID:", socket.id);
      // console.log("🔌 Socket connected:", socket.connected);

      // Manually request online users
      socket.emit("online:get-users");

      // Listen for everything to debug
      const debugListener = (event: string, ...args: any[]) => {
        // console.log("📡 Socket event:", event, args);
      };

      socket.onAny(debugListener);

      return () => {
        socket.offAny(debugListener);
      };
    }
  }, [socket]);

  return (
    <div className="text-xs p-2 bg-gray-800 text-white rounded">
      <div>
        Socket: {socket?.connected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>
      <div>Online Users: {onlineUsers.size}</div>
      <div>User IDs: {Array.from(onlineUsers).join(", ")}</div>
    </div>
  );
};
