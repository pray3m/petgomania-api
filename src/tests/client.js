// client.js
import { io } from "socket.io-client";

// Connect to the Socket.io server
const socket = io("http://localhost:5001");

socket.on("connect", () => {
  console.log(`Connected as ${socket.id}`);

  // Join a conversation room
  socket.emit("join_conversation", 1);
  console.log("Joined conversation 1");

  // Send a message
  socket.emit("send_message", {
    conversationId: 1,
   message: "Hello! Is your pet still available for adoption?",
  });

  // Listen for new messages
  socket.on("new_message", (message) => {
    console.log("New message received:", message);
  });

  // Leave the conversation after 10 seconds
  setTimeout(() => {
    socket.emit("leave_conversation", 1);
    console.log("Left conversation 1");
    socket.disconnect();
  }, 10000);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
