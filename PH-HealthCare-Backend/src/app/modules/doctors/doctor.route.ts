import { Router } from "express";
import { doctorController } from "./doctor.controller";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.get("/", authMiddleware(Role.PATIENT), doctorController.getAllDoctor);

route.get("/:id", doctorController.getDoctorById);

export const doctorRoute = route;
