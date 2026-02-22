import { Router } from "express";
import { userController } from "./user.controller";
import { zodValidation } from "../../middleware/zodValidation";
import { createDoctorZodSchema } from "./user.validation";

const route = Router();

route.post(
  "/create-doctor",
  zodValidation(createDoctorZodSchema),
  userController.createDoctor,
);

export const userRoute = route;
