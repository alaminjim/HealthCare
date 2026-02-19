import express, { Application, Request, Response } from "express";
import { indexRouter } from "./app/routes";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1", indexRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hello health care");
});

export default app;
