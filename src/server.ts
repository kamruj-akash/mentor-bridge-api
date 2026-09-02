import app from "./app";
import { connectRedis, disconnectRedis } from "./config/redis";

const PORT = process.env.PORT || 4000;

async function server() {
  try {
    await connectRedis();

    const httpServer = app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      httpServer.close();
      await disconnectRedis();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Error in main function:", error);
    process.exit(1);
  }
}

server();
