/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { envConfig } from "../config/env";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { IError } from "../interface/error.interface";
import { zodError } from "../error/zodError";
import AppError from "../../errorHelper/appError";
import { cloudinaryDelete } from "../config/cloudinary.config";

const errorHandler = async (
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

  if (req.file) {
    await cloudinaryDelete(req.file?.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file: any) => file.path);
    await Promise.all(imageUrls.map((image: any) => cloudinaryDelete(image)));
  }

  let errorSources: IError[] = [];
  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  let message: string = "Internal server error";
  let stack: string | undefined = undefined;

  if (err instanceof z.ZodError) {
    const simplifiedError = zodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...(simplifiedError.errorSources || [])];
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    error: envConfig.NODE_DEV === "development" ? err : undefined,
    stack: envConfig.NODE_DEV === "development" ? stack : undefined,
  });
};

export default errorHandler;
