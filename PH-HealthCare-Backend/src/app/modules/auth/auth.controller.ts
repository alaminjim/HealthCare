import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { authService } from "./auth.service";

const authRegister = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authRegister(payload);
  res.status(201).json({ success: true, data: result });
});

const authLogin = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authLogin(payload);
  res.status(201).json({ success: true, data: result });
});

export const authController = {
  authRegister,
  authLogin,
};
