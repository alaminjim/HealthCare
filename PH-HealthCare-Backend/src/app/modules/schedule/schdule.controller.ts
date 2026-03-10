import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { StatusCodes } from "http-status-codes";
import { scheduleService } from "./schedule.service";
import { IQueryParams } from "../../interface/queryBuilders.i";

const createSchedule = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await scheduleService.createSchedule(payload);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: result,
    message: "Schedule created successful",
  });
});

const getAllSchedule = catchFn(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await scheduleService.getAllSchedules(query as IQueryParams);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result,
    message: "Schedule get successful",
  });
});

const getScheduleById = catchFn(async (req: Request, res: Response) => {
  const { id } = req.params;
  const schedule = await scheduleService.getScheduleById(id as string);
  res.status(StatusCodes.OK).json({
    success: true,
    data: schedule,
    message: "Schedule get successful",
  });
});

const updateSchedule = catchFn(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await scheduleService.updateSchedule(id as string, payload);
  res.status(StatusCodes.CREATED).json({
    success: true,
    data: result,
    message: "Schedule update successful",
  });
});

const deleteSchedule = catchFn(async (req: Request, res: Response) => {
  const { id } = req.params;
  await scheduleService.deleteSchedule(id as string);
  res.status(StatusCodes.OK).json({
    success: true,

    message: "Schedule delete successful",
  });
});

export const scheduleController = {
  createSchedule,
  getAllSchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
