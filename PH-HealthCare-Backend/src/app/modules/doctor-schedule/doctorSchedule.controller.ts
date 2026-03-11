import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { StatusCodes } from "http-status-codes";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IQueryParams } from "../../interface/queryBuilders.i";

const createMyDoctorSchedule = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await DoctorScheduleService.createMyDoctorSchedule(
    user,
    payload,
  );
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getMyDoctorSchedules = catchFn(async (req: Request, res: Response) => {
  const user = req.user;
  const query = req.query;
  const result = await DoctorScheduleService.getMyDoctorSchedules(
    user,
    query as IQueryParams,
  );
  res
    .status(StatusCodes.OK)
    .json({ success: true, data: result.data, meta: result.meta });
});

const getAllDoctorSchedules = catchFn(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await DoctorScheduleService.getAllDoctorSchedules(
    query as IQueryParams,
  );
  res
    .status(StatusCodes.OK)
    .json({ success: true, data: result.data, meta: result.meta });
});

const getDoctorScheduleById = catchFn(async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId;
  const scheduleId = req.params.scheduleId;
  const result = await DoctorScheduleService.getDoctorScheduleById(
    doctorId as string,
    scheduleId as string,
  );
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const updateMyDoctorSchedule = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.user;
  const result = await DoctorScheduleService.updateMyDoctorSchedule(
    user,
    payload,
  );
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const deleteMyDoctorSchedule = catchFn(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  await DoctorScheduleService.deleteMyDoctorSchedule(id as string, user);
  res.status(StatusCodes.OK).json({ success: true });
});

export const DoctorScheduleController = {
  createMyDoctorSchedule,
  getMyDoctorSchedules,
  getAllDoctorSchedules,
  getDoctorScheduleById,
  updateMyDoctorSchedule,
  deleteMyDoctorSchedule,
};
