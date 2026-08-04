import { z } from "zod";

export const createBookingSchema = z.object({
  serviceId: z.uuid("invalid service id"),
  scheduledDate: z.coerce.date(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum([
    "ACCEPTED",
    "DECLINED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export const bookingIdParamSchema = z.object({
  id: z.uuid("invalid booking id"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
