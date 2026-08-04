import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import {
  addBooking,
  changeBookingStatus,
  getBookingDetails,
  getBookings,
  getMyBookings,
} from "./booking.controller";

const bookingRouter: IRouter = Router();

bookingRouter.post("/", auth("CUSTOMER"), addBooking);
bookingRouter.get("/my", auth("CUSTOMER"), getMyBookings);
bookingRouter.get("/", auth("ADMIN"), getBookings);
bookingRouter.get("/:id", auth(), getBookingDetails);
bookingRouter.patch("/:id", auth("CUSTOMER", "TECHNICIAN", "ADMIN"), changeBookingStatus);

export default bookingRouter;
