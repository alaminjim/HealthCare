import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { zodValidation } from "../../middleware/zodValidation";
import { DoctorValidation } from "./doctors.validation";

const route = Router();

route.get("/", authMiddleware(Role.PATIENT), doctorController.getAllDoctor);

route.get("/:id", doctorController.getDoctorById);

route.patch(
  "/:id",
  authMiddleware(),
  zodValidation(DoctorValidation.updateDoctorValidationSchema),
  doctorController.updateDoctor,
);

route.delete(
  "/:id",
  authMiddleware(Role.ADMIN, Role.SUPER_ADMIN),
  doctorController.deleteDoctor,
);

export const doctorRoute = route;
