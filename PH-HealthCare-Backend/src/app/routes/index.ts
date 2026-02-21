import { Router } from "express";
import { specialtyRoute } from "../modules/specialty/specialty.route";
import { authRoute } from "../modules/auth/auth.routes";
import { userRoute } from "../modules/user/user.routes";
import { doctorRoute } from "../modules/doctors/doctor.route";

const router = Router();

router.use("/specialty", specialtyRoute);

router.use("/auth", authRoute);

router.use("/users", userRoute);

router.use("/doctor", doctorRoute);

export const indexRouter = router;
