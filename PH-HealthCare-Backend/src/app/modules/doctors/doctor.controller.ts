import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { doctorService } from "./doctor.service";
import { StatusCodes } from "http-status-codes";

const getAllDoctor = catchFn(async (req: Request, res: Response) => {
  const result = await doctorService.getAllDoctor();
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getDoctorById = catchFn(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await doctorService.getDoctorById(id as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

export const doctorController = {
  getAllDoctor,
  getDoctorById,
};
