import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import catchFn from "../../shared/catchFn";

const createSpecialty = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialtyService.createSpecialty(payload);
  res.status(201).json({ message: true, data: result });
});

const getSpecialty = catchFn(async (req: Request, res: Response) => {
  const result = await specialtyService.getSpecialty();
  res.status(201).json({ success: true, data: result });
});

const updateSpecialty = catchFn(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await specialtyService.updateSpecialty(id as string, payload);
  res.status(201).json({ success: true, data: result });
});

const deleteSpecialty = catchFn(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await specialtyService.deleteSpecialty(id as string);
  res.status(201).json({ success: true, data: result });
});

export const specialtyController = {
  createSpecialty,
  getSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
