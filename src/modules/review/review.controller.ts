import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { createReviewSchema } from "./review.validation";
import { createReview } from "./review.service";
import prisma from "../../lib/prisma";

export const addReview = catchAsync(async (req: Request, res: Response) => {
  const input = createReviewSchema.parse(req.body);

  const review = await createReview(req.user!.id, input);

  sendResponse(
    res,
    { message: "Review submitted successfully", data: { review } },
    201,
  );
});

export const getReviews = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.query.serviceId as string | undefined;
  const technicianId = req.query.technicianId as string | undefined;

  const where: any = {};
  if (serviceId) where.booking = { serviceId };
  if (technicianId) where.booking = { technicianId };

  const reviews = await prisma.review.findMany({
    where,
    include: {
      booking: { include: { service: true } },
      customer: { omit: { password: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Reviews retrieved successfully",
    data: { reviews },
  });
});
