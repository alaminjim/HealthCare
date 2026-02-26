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
router.post(
  "/change-password",
  authMiddleware(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  authController.changePassword,
);
router.post(
  "/logout",
  authMiddleware(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
  authController.logOut,
);

export const authRoute = router;
