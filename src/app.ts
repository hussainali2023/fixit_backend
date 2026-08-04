import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";

import { notFoundHandler } from "./middleware/not-found";
import { globalErrorHandler } from "./middleware/global-error";

const app: Application = express();



app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("FixItNow Backend Server is running 🔧");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
