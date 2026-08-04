import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import { checkout, getMyPayments, getPaymentDetails } from "./payment.controller";

const paymentRouter: IRouter = Router();

paymentRouter.post("/checkout/:bookingId", auth("CUSTOMER"), checkout);
paymentRouter.get("/my", auth("CUSTOMER"), getMyPayments);
paymentRouter.get("/:id", auth("CUSTOMER", "ADMIN"), getPaymentDetails);

export default paymentRouter;
