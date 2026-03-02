import { Router } from "express";
import { specialtyController } from "./specialty.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.get("/", specialtyController.getSpecialty);

router.post(
  "/",
  multerUpload.single("file"),
  specialtyController.createSpecialty,
);

router.put("/:id", specialtyController.updateSpecialty);

router.delete("/:id", specialtyController.deleteSpecialty);

export const specialtyRoute = router;
