const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
require("dotenv").config();

// Create server
const server = http.createServer(app);

// Socket.io setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users
const onlineUsers = new Map();

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Register user
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Send message
  socket.on("send_message", (data) => {
    const receiverSocket = onlineUsers.get(data.receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", data);
    }
  });

  // Send notification
  socket.on("send_notification", (data) => {
    const receiverSocket = onlineUsers.get(data.userId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("get_notification", data);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});