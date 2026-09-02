import { redisClient } from "../../config/redis";
import type { IRegisterUser } from "./auth.interface";

const regUser = async (payload: IRegisterUser) => {
  const { name, email, password, role } = payload;
  const isUserExists = await prismaClient
  const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const storedUser = await redisClient.set(
    `newUser:${email}`,
    JSON.stringify({ name, email, password, role }),
    { EX: 3600 },
  );
  const storedOtp = await redisClient.set(`registerOtp:${email}`, generateOtp, {
    EX: 3600,
  });
};
