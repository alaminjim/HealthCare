import { Router } from "express";
import { specialtyRoute } from "../modules/specialty/specialty.route";
import { authRoute } from "../modules/auth/auth.routes";

const router = Router();

router.use("/specialty", specialtyRoute);

router.use("/auth", authRoute);

export const indexRouter = router;
