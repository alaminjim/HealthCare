import { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/env";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { IError } from "../interface/error.interface";
import { zodError } from "../error/zodError";

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

  let errorSources: IError[] = [];

  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

  let message: string = "Internal server error";

  if (err instanceof z.ZodError) {
    const simplifiedError = zodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...(simplifiedError.errorSources || [])];
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    error: envConfig.NODE_DEV === "development" ? err : undefined,
  });
};

export default errorHandler;
