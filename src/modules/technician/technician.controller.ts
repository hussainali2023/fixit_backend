import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import prisma from "../../lib/prisma";
import {
  technicianIdParamSchema,
  updateAvailabilitySchema,
  updateProfileSchema,
} from "./technician.validation";
import {
  getTechnicianById,
  updateTechnicianAvailability,
  updateTechnicianProfile,
} from "./technician.service";

export const getTechnicians = catchAsync(async (_req: Request, res: Response) => {
  const technicians = await prisma.technicianProfile.findMany({
    include: {
      user: { omit: { password: true } },
      services: true,
    },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Technicians retrieved successfully",
    data: { technicians },
  });
});

export const getTechnician = catchAsync(async (req: Request, res: Response) => {
  const { id } = technicianIdParamSchema.parse(req.params);
  const technician = await getTechnicianById(id);

  sendResponse(res, {
    message: "Technician retrieved successfully",
    data: { technician },
  });
});

export const editProfile = catchAsync(async (req: Request, res: Response) => {
  const input = updateProfileSchema.parse(req.body);
  const profile = await updateTechnicianProfile(req.user!.id, input);

  sendResponse(res, {
    message: "Profile updated successfully",
    data: { profile },
  });
});

export const editAvailability = catchAsync(async (req: Request, res: Response) => {
  const input = updateAvailabilitySchema.parse(req.body);
  const profile = await updateTechnicianAvailability(req.user!.id, input);

  sendResponse(res, {
    message: "Availability updated successfully",
    data: { profile },
  });
});
