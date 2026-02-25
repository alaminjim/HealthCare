import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelper/appError";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envConfig } from "../config/env";
import { jwtUtils } from "../utils/jwt";
import { cookieUtils } from "../utils/cookie";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

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

      let user;

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
          user = sessionTokenExists.user;

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

      if (!user) {
        throw new AppError(
          StatusCodes.UNAUTHORIZED,
          "Unauthorized access! User not found.",
        );
      }

      req.user = user;

      next();
    } catch (error) {
      next(error);
    }
  };
