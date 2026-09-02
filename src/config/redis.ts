import { RedisClient } from "bun";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new RedisClient(REDIS_URL);

redis.onconnect = () => {
  console.log("Redis connected");
};

redis.onclose = (error) => {
  console.error("Redis connection closed:", error?.message ?? error);
};

export async function connectRedis() {
  await redis.connect();
  return redis;
}

export async function disconnectRedis() {
  redis.close();
}
