import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { getServiceById } from "../service/service.service";
import type { CreateBookingInput, UpdateBookingStatusInput } from "./booking.validation";

export async function createBooking(
  customerId: string,
  input: CreateBookingInput,
) {
  const service = await getServiceById(input.serviceId);

  return prisma.booking.create({
    data: {
      serviceId: service.id,
      customerId,
      technicianId: service.technicianId,
      scheduledDate: input.scheduledDate,
      totalPrice: service.price,
      status: "REQUESTED",
    },
    include: {
      service: true,
      technician: { include: { user: { omit: { password: true } } } },
    },
  });
}

export async function updateBookingStatus(
  userId: string,
  userRole: string,
  bookingId: string,
  input: UpdateBookingStatusInput,
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { technician: true },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (userRole === "CUSTOMER") {
    if (booking.customerId !== userId) {
      throw new AppError(403, "Forbidden - Not your booking");
    }
    if (input.status !== "CANCELLED") {
      throw new AppError(400, "Customer can only cancel booking");
    }
    if (booking.status === "IN_PROGRESS" || booking.status === "COMPLETED") {
      throw new AppError(400, "Cannot cancel job in progress or completed");
    }
  } else if (userRole === "TECHNICIAN") {
    if (booking.technician.userId !== userId) {
      throw new AppError(403, "Forbidden - Job not assigned to you");
    }
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: input.status },
    include: {
      service: true,
      customer: { omit: { password: true } },
      technician: { include: { user: { omit: { password: true } } } },
      payment: true,
    },
  });
}
