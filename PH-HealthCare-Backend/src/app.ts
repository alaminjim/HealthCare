/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import { indexRouter } from "./app/routes";
import errorHandler from "./app/middleware/errorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import { envConfig } from "./app/config/env";
import cors from "cors";
import qs from "qs";
import { PaymentController } from "./app/modules/payment/payment.controller";
import { AppointmentService } from "./app/modules/appoinment/appionment.service";
import cron from "node-cron";

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));

app.post(
  "/webhook",
  express.raw({ type: "Application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/template"));

app.use(
  cors({
    origin: [
      envConfig.FRONTEND_URL,
      envConfig.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

cron.schedule("*/25 * * * *", async () => {
  try {
    console.log("Running cron job to cancel unpaid appointments...");
    await AppointmentService.cancelUnpaidAppointments();
  } catch (error: any) {
    console.error(
      "Error occurred while canceling unpaid appointments:",
      error.message,
    );
  }
});

app.use("/api/auth", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", indexRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hello health care");
});

app.use(errorHandler);

app.use(notFound);

export default app;
