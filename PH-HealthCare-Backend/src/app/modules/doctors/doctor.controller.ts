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

const updateDoctor = catchFn(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  console.log(payload);
  const result = await doctorService.updateDoctor(payload, id as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const deleteDoctor = catchFn(async (req: Request, res: Response) => {
  const id = req.params.id;
  await doctorService.deleteDoctor(id as string);
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Deleted SuccessFul", data: null });
});

export const doctorController = {
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
