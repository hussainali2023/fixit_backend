import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { CreateReviewInput } from "./review.validation";

export async function createReview(customerId: string, input: CreateReviewInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: {
      payment: true,
      service: true,
      technician: { include: { user: { omit: { password: true } } } },
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.customerId !== customerId) {
    throw new AppError(403, "Forbidden - Not your booking");
  }

  // Ensure user can ONLY review after payment is completed
  const isPaymentCompleted =
    booking.payment?.status === "COMPLETED" ||
    booking.status === "PAID" ||
    booking.status === "COMPLETED";

  if (!isPaymentCompleted) {
    throw new AppError(
      400,
      "Only after completing the payment can you submit a review for this service and technician",
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: { bookingId: input.bookingId },
  });

  if (existingReview) {
    throw new AppError(409, "Review already submitted for this booking");
  }

  return prisma.review.create({
    data: {
      bookingId: input.bookingId,
      customerId,
      rating: input.rating,
      comment: input.comment,
    },
    include: {
      booking: {
        include: {
          service: true,
          technician: { include: { user: { omit: { password: true } } } },
        },
      },
      customer: { omit: { password: true } },
    },
  });
}
