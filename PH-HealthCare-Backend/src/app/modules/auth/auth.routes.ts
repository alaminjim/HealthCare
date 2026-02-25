import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "../../../generated/prisma/enums";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.post("/register", authController.authRegister);

router.post("/login", authController.authLogin);

router.get(
  "/me",
  authMiddleware(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  authController.authMe,
);

router.post("/refresh-token", authController.getNewToken);

export const authRoute = router;
