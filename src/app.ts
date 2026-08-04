import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/user/user.routes";

import { notFoundHandler } from "./middleware/not-found";
import { globalErrorHandler } from "./middleware/global-error";
import technicianRouter from "./modules/technician/technician.routes";
import serviceRouter from "./modules/service/service.routes";
import bookingRouter from "./modules/booking/booking.routes";
import paymentRouter from "./modules/payment/payment.routes";
import { webhook } from "./modules/payment/payment.controller";

const app: Application = express();

app.post("/webhook", express.raw({ type: "application/json" }), webhook);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("FixItNow Backend Server is running 🔧");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/technicians", technicianRouter)
app.use("/api/services", serviceRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/payments", paymentRouter)

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
