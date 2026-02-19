import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await specialtyService.createSpecialty(payload);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error });
  }
};

const getSpecialty = async (req: Request, res: Response) => {
  try {
    const result = await specialtyService.getSpecialty();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error });
  }
};

const updateSpecialty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const result = await specialtyService.updateSpecialty(
      id as string,
      payload,
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error });
  }
};

const deleteSpecialty = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await specialtyService.deleteSpecialty(id as string);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error });
  }
};

export const specialtyController = {
  createSpecialty,
  getSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
