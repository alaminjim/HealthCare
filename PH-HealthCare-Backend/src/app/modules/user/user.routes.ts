import { Router } from "express";
import { userController } from "./user.controller";

const route = Router();

route.post("/create-doctor", userController.createDoctor);

export const userRoute = route;
