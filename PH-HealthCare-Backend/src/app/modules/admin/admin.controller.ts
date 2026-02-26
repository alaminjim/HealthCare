import { StatusCodes } from "http-status-codes";
import catchFn from "../../shared/catchFn";
import { adminService } from "./admin.service";
import { Request, Response } from "express";

const getAllAdmin = catchFn(async (req: Request, res: Response) => {
  const result = await adminService.getAllAdmin();
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getIdByAdmin = catchFn(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getIdByAdmin(id as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const updateAdmin = catchFn(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await adminService.updateAdmin(payload, id as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const deleteAdmin = catchFn(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = req?.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const result = await adminService.adminDeleted(id as string, user);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

export const adminController = {
  getAllAdmin,
  getIdByAdmin,
  updateAdmin,
  deleteAdmin,
};
