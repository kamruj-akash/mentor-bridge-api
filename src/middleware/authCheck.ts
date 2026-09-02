import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { UserStatus, type Role } from "../../prisma/src/generated/prisma/enums";
import envConfig from "../config/env";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

export interface RequestUser {
  email: string;
  name: string;
  userId: string;
  role: Role;
  phoneNo?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

// auth(Role.ADMIN, Role.USER, Role.Author)
// auth() => ...requiredRoles => [Role.ADMIN, Role.USER, Role.AUTHOR]
export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      let token = req.cookies?.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;
      const refreshToken = req.cookies.refreshToken;

      if (!token) {
        if (!refreshToken) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You are not logged in. Please log in to access this resource.",
          );
        }
        const verifyRefreshToken = jwtUtils.verifyToken(
          refreshToken,
          envConfig.jwt_refresh_secret,
        );

        if (!verifyRefreshToken.success) {
          throw new AppError(httpStatus.UNAUTHORIZED, verifyRefreshToken.error);
        }

        const jwtPayload = verifyRefreshToken.data as JwtPayload;
        const { iat, exp, ...cleanPayload } = jwtPayload;

        const newAccessToken = jwtUtils.createToken(
          cleanPayload,
          envConfig.jwt_access_secret,
          envConfig.jwt_access_expires_in as SignOptions,
        );

        _res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "production",
          sameSite: "none",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        token = newAccessToken;
      }

      const verifiedToken = jwtUtils.verifyToken(
        token,
        envConfig.jwt_access_secret,
      );

      if (!verifiedToken.success) {
        throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error);
      }

      const { email, name, userId, role } = verifiedToken.data as JwtPayload;

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Forbidden. You don't have permission to access this resource.",
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          email,
          name,
          role,
        },
      });

      if (!user) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "User not found. Please log in again.",
        );
      }

      if (user.status === UserStatus.BLOCK) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Your account has been blocked. Please contact support.",
        );
      }
      const userData = {
        email: user.email,
        name: user.name,
        phoneNo: user.phoneNo || "",
        userId: user.id,
        role: user.role,
      };

      req.user = userData;

      next();
    },
  );
};
