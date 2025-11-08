// backend/utils/socketHelper.js
// Helper functions for Socket.io

let io;

// Initialize socket.io instance
const initSocket = (socketInstance) => {
  io = socketInstance;
};

// Get socket.io instance
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

// Emit notification to specific user
const emitToUser = (userId, event, data) => {
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }

  io.to(`user_${userId}`).emit(event, data);
  console.log(`Emitted ${event} to user ${userId}:`, data);
};

// Emit notification to multiple users
const emitToUsers = (userIds, event, data) => {
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }

  userIds.forEach((userId) => {
    io.to(`user_${userId}`).emit(event, data);
  });

  console.log(`Emitted ${event} to ${userIds.length} users`);
};

// Emit to all connected clients
const emitToAll = (event, data) => {
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }

  io.emit(event, data);
  console.log(`Emitted ${event} to all users`);
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToUsers,
  emitToAll,
};
