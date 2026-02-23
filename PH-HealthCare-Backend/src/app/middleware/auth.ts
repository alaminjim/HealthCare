import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../../errorHelper/appError";
import { prisma } from "../lib/prisma";
import { StatusCodes } from "http-status-codes";
import { jwtUtils } from "../utils/jwt";
import { envConfig } from "../config/env";

export const checkAuth =
  (...userRole: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided");
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percent = (timeRemaining / sessionLifeTime) * 100;

          if (percent < 20) {
            res.header("X-token-refresh");
            res.header("X-session-expiresAt-at", expiresAt.toISOString());
            res.header("X-time-remaining", timeRemaining.toString());

            console.log("session expireing soon");
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "User not active");
          }

          if (user.isDeleted) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "User is deleted");
          }

          if (userRole.length > 0 && !userRole.includes(user.role)) {
            throw new AppError(StatusCodes.FORBIDDEN, "Forbidden Access");
          }
        }
      }

      //   access token

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized access token",
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envConfig.ACCESS_TOKEN,
      );

      if (!verifiedToken.success) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "inValid access Token");
      }

      if (
        userRole.length > 0 &&
        !userRole.includes(verifiedToken.data!.role as Role)
      ) {
        throw new AppError(StatusCodes.FORBIDDEN, "Forbidden access");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
