import { Router } from "express";
import { specialtyRoute } from "../modules/specialty/specialty.route";

const router = Router();

router.use("/specialty", specialtyRoute);

export const indexRouter = router;
