import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.authRegister);

router.post("/login", authController.authLogin);

export const authRoute = router;
