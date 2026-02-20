import { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/env";
import { StatusCodes } from "http-status-codes";

const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (envConfig.NODE_DEV === "development") {
    throw err;
  }

  const statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

  const message: string = "Internal server error";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
};

export default errorHandler;
