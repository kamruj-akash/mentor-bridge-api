import { createClient } from "redis";
import envConfig from "./env";

export const redisClient = createClient({
  username: envConfig.redis_user,
  password: envConfig.redis_pass,
  socket: {
    host: envConfig.redis_host,
    port: Number(envConfig.redis_port),
  },
});
