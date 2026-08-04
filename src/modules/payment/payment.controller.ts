import type { Request, Response } from "express";
import { z } from "zod";
import stripe from "../../lib/stripe";
import config from "../../config";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { AppError } from "../../utils/app-error";
import { completePayment, createCheckoutSession } from "./payment.service";
import prisma from "../../lib/prisma";

const bookingIdParamSchema = z.object({
  bookingId: z.uuid("invalid booking id"),
});

const paymentIdParamSchema = z.object({
  id: z.uuid("invalid payment id"),
});

export const checkout = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = bookingIdParamSchema.parse(req.params);

  const result = await createCheckoutSession(req.user!.id, bookingId);

  sendResponse(res, { message: "Checkout session created", data: result });
});

export const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await prisma.payment.findMany({
    where: { booking: { customerId: req.user!.id } },
    include: { booking: { include: { service: true } } },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Payments retrieved successfully",
    data: { payments },
  });
});

export const getPaymentDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = paymentIdParamSchema.parse(req.params);

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { booking: { include: { service: true } } },
  });

  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  sendResponse(res, {
    message: "Payment retrieved successfully",
    data: { payment },
  });
});

export const webhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    throw new AppError(400, "Missing stripe-signature header");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    throw new AppError(400, "Invalid webhook signature");
  }

  const session = event.data.object as { id: string; metadata?: { bookingId?: string } };
  const bookingId = session.metadata?.bookingId;

  if (bookingId) {
    if (event.type === "checkout.session.completed") {
      await completePayment(bookingId, session.id);
    } else if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      await prisma.payment.updateMany({
        where: { bookingId, status: "PENDING" },
        data: { status: "FAILED" },
      });
    }
  }

  res.json({ received: true });
});
