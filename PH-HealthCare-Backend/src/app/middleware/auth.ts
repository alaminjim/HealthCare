import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/appError";
import { jwtUtils } from "../utils/jwt";
import { envConfig } from "../config/env";

export const authMiddleware =
  (...userRole: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookies(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided.");
      }

      if (sessionToken) {
        const sessionTokenExists = await prisma.session.findFirst({
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

        if (sessionTokenExists && sessionTokenExists.user) {
          const user = sessionTokenExists.user;
          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              StatusCodes.UNAUTHORIZED,
              "Unauthorized access! User is not active.",
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              StatusCodes.UNAUTHORIZED,
              "Unauthorized access! User is deleted.",
            );
          }

          if (userRole.length > 0 && !userRole.includes(user.role)) {
            throw new AppError(
              StatusCodes.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource.",
            );
          }
        }
      }

      const accessToken = cookieUtils.getCookies(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized access! No access token provided.",
        );
      }

      const verificationToken = jwtUtils.verifiedToken(
        accessToken,
        envConfig.ACCESS_TOKEN,
      );

      if (!verificationToken.success) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized access! Invalid access token.",
        );
      }

      if (
        userRole.length > 0 &&
        !userRole.includes(verificationToken.verified!.role as Role)
      ) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
