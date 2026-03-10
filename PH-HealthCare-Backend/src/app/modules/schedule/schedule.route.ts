import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { authMiddleware } from "../../middleware/auth";
import { zodValidation } from "../../middleware/zodValidation";
import { scheduleController } from "./schdule.controller";
import { ScheduleValidation } from "./schdule.validation";

const router = Router();

router.post(
  "/",
  authMiddleware(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidation(ScheduleValidation.createScheduleZodSchema),
  scheduleController.createSchedule,
);
router.get(
  "/",
  authMiddleware(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  scheduleController.getAllSchedule,
);
router.get(
  "/:id",
  authMiddleware(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  scheduleController.getScheduleById,
);
router.patch(
  "/:id",
  authMiddleware(Role.ADMIN, Role.SUPER_ADMIN),
  zodValidation(ScheduleValidation.updateScheduleZodSchema),
  scheduleController.updateSchedule,
);
router.delete(
  "/:id",
  authMiddleware(Role.ADMIN, Role.SUPER_ADMIN),
  scheduleController.deleteSchedule,
);

export const scheduleRoute = router;
