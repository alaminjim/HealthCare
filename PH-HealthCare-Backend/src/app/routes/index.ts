import { Router } from "express";
import { specialtyRoute } from "../modules/specialty/specialty.route";
import { authRoute } from "../modules/auth/auth.routes";
import { userRoute } from "../modules/user/user.routes";

const router = Router();

router.use("/specialty", specialtyRoute);

router.use("/auth", authRoute);

router.use("/doctor", userRoute);

export const indexRouter = router;
