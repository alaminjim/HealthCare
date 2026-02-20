import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

const authRegister = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authRegister(payload);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const authLogin = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authLogin(payload);
  res
    .status(StatusCodes.OK)
    .json({ success: true, data: result, message: "Login successful" });
});

export const authController = {
  authRegister,
  authLogin,
};
