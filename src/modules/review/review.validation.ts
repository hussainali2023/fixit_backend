import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.uuid("invalid booking id"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1, "comment is required"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
