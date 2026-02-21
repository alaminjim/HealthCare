import { Router } from "express";
import { doctorController } from "./doctor.controller";

const route = Router();

route.get("/", doctorController.getAllDoctor);

route.get("/:id", doctorController.getDoctorById);

export const doctorRoute = route;
