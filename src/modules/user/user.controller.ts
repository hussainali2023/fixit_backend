import type { Request, Response } from "express";
import { getCurrentUser, updateUserStatus } from "./user.service";
import prisma from "../../lib/prisma";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { AppError } from "../../utils/app-error";

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, { message: "User not authenticated" }, 401);
  }

  const user = await getCurrentUser(req.user.id);

  if (!user) {
    return sendResponse(res, { message: "User not found" }, 404);
  }

  return sendResponse(res, {
    data: { user },
    message: "User retrieved successfully",
  });
});

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    omit: { password: true },
    include: { technicianProfile: true },
  });
  return sendResponse(res, {
    data: { users },
    message: "Users retrieved successfully",
  });
});

export const editUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { isBanned } = req.body;

  const user = await updateUserStatus(id, { isBanned });

  return sendResponse(res, {
    data: { user },
    message: "User status updated successfully",
  });
});

// export const editUserStatus = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id as string;
//   const { isBanned } = req.body;

//   // Validate ID
//   if (!id) {
//     throw new AppError(400, 'User ID is required');
//   }

//   // Validate isBanned is provided and is boolean
//   if (typeof isBanned !== 'boolean') {
//     throw new AppError(400, 'isBanned must be a boolean value');
//   }

//   const user = await updateUserStatus(id, { isBanned });

//   // Check if user exists
//   if (!user) {
//     throw new AppError(400, 'User not found');
//   }

//   return sendResponse(res, {
//     data: { user },
//     message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
//   });
// });
