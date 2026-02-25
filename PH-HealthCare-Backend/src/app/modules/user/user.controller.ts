import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { userService } from "./user.service";
import { StatusCodes } from "http-status-codes";

const createDoctor = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createDoctor(payload);
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
});

const createAdmin = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
});

const createSuperAdmin = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createSuperAdmin(payload);
  res.status(StatusCodes.CREATED).json({ success: true, data: result });
});

export const userController = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
