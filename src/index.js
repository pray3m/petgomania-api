import "dotenv/config";
import { createServer } from "http";
import app from "./app.js";
import { initializeSocket } from "./services/socketService.js";

const PORT = process.env.PORT || 5001;

// Create HTTP server
const httpServer = createServer(app);

initializeSocket(httpServer);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
