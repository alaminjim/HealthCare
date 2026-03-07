import { Router } from "express";
import { userController } from "./user.controller";
import { zodValidation } from "../../middleware/zodValidation";
import {
  createAdminZodSchema,
  createDoctorZodSchema,
  createSuperAdminZodSchema,
} from "./user.validation";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.post(
  "/create-doctor",
  zodValidation(createDoctorZodSchema),
  userController.createDoctor,
);

route.post(
  "/create-admin",
  authMiddleware(Role.SUPER_ADMIN),
  zodValidation(createAdminZodSchema),
  userController.createAdmin,
);

route.post(
  "/create-superAdmin",
  zodValidation(createSuperAdminZodSchema),
  userController.createSuperAdmin,
);

export const userRoute = route;
