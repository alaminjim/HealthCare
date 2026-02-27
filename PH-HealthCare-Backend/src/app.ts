import express, { Application, Request, Response } from "express";
import { indexRouter } from "./app/routes";
import errorHandler from "./app/middleware/errorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";

const app: Application = express();

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
