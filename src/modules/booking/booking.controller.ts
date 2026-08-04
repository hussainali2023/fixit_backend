import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import {
  bookingIdParamSchema,
  createBookingSchema,
  updateBookingStatusSchema,
} from "./booking.validation";
import { createBooking, updateBookingStatus } from "./booking.service";
import prisma from "../../lib/prisma";

export const addBooking = catchAsync(async (req: Request, res: Response) => {
  const input = createBookingSchema.parse(req.body);

  const booking = await createBooking(req.user!.id, input);

  sendResponse(
    res,
    { message: "Booking created successfully", data: { booking } },
    201,
  );
});

export const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId: req.user!.id },
    include: {
      service: true,
      technician: { include: { user: { omit: { password: true } } } },
      payment: true,
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Bookings retrieved successfully",
    data: { bookings },
  });
});

export const getBookings = catchAsync(async (_req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { include: { user: { omit: { password: true } } } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Bookings retrieved successfully",
    data: { bookings },
  });
});

export const getBookingDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = bookingIdParamSchema.parse(req.params);

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { include: { user: { omit: { password: true } } } },
      payment: true,
      review: true,
    },
  });

  if (!booking) {
    return sendResponse(res, { message: "Booking not found" }, 404);
  }

  sendResponse(res, {
    message: "Booking retrieved successfully",
    data: { booking },
  });
});

export const changeBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = bookingIdParamSchema.parse(req.params);
  const input = updateBookingStatusSchema.parse(req.body);

  const booking = await updateBookingStatus(
    req.user!.id,
    req.user!.role,
    id,
    input,
  );

  sendResponse(res, {
    message: "Booking status updated successfully",
    data: { booking },
  });
});
