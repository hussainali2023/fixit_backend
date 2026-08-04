import type { Prisma } from "../../../prisma/generated/prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { UpdateAvailabilityInput, UpdateProfileInput } from "./technician.validation";

export async function getTechnicianById(id: string) {
  const technician = await prisma.technicianProfile.findUnique({
    where: { id },
    include: {
      user: { omit: { password: true } },
      services: true,
      bookings: {
        include: {
          review: true,
        },
      },
    },
  });

  if (!technician) {
    throw new AppError(404, "Technician not found");
  }

  return technician;
}

export async function updateTechnicianProfile(userId: string, input: UpdateProfileInput) {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(404, "Technician profile not found");
  }

  return prisma.technicianProfile.update({
    where: { userId },
    data: input as Prisma.TechnicianProfileUpdateInput,
    include: { user: { omit: { password: true } } },
  });
}

export async function updateTechnicianAvailability(userId: string, input: UpdateAvailabilityInput) {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(404, "Technician profile not found");
  }

  return prisma.technicianProfile.update({
    where: { userId },
    data: { availability: input.availability },
  });
}
