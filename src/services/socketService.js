import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // join a conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // // handle new message event
    // socket.on("send_message", async ({ conversationId, message }) => {
    //   // save the message to the db
    //   console.log(`New message: ${message}`);

    //   // broadcast the message to all users in the conversation
    //   io.to(`conversation_${conversationId}`).emit("new_message", message);
    // });

    // leave a conversation room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log("User left the conversation", conversationId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};
