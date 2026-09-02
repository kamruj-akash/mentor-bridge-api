import app from "./app";
import { redisClient } from "./config/redis";

const PORT = process.env.PORT || 4000;

async function server() {
  try {
    await redisClient.connect();

    const httpServer = app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      httpServer.close();
      await redisClient.quit();
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
