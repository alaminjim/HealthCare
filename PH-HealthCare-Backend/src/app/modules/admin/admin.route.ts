import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/", adminController.getAllAdmin);

router.get("/:id", adminController.getIdByAdmin);

router.patch("/:id", adminController.updateAdmin);

router.delete("/:id", authMiddleware(), adminController.deleteAdmin);

export const adminRoute = router;
