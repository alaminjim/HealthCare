import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { StatusCodes } from "http-status-codes";
import { scheduleService } from "./schedule.service";

const createSchedule = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await scheduleService.createSchedule(payload);

  res.status(StatusCodes.CREATED).json({ success: true, data: result });
});

export const scheduleController = {
  createSchedule,
};
