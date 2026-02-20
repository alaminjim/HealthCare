import express, { Application, Request, Response } from "express";
import { indexRouter } from "./app/routes";
import errorHandler from "./app/middleware/errorHandler";
import notFound from "./app/middleware/notFound";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1", indexRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hello health care");
});

app.use(errorHandler);

app.use(notFound);

export default app;
