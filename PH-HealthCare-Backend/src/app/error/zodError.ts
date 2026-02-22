import z from "zod";
import { IError, TErrorResponse } from "../interface/error.interface";
import { StatusCodes } from "http-status-codes";

export const zodError = (err: z.ZodError): TErrorResponse => {
  const statusCode = StatusCodes.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources: IError[] = [];

  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message,
    });
  });
  return {
    success: false,
    statusCode,
    message,
    errorSources,
  };
};
