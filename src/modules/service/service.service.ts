import type { Prisma } from "../../../prisma/generated/prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { CreateServiceInput, UpdateServiceInput } from "./service.validation";

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { technician: { include: { user: { omit: { password: true } } } } },
  });

  if (!service) {
    throw new AppError(404, "Service not found");
  }

  return service;
}

export async function createService(userId: string, input: CreateServiceInput) {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!technicianProfile) {
    throw new AppError(404, "Unauthorized User");
  }

  return prisma.service.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category ?? "General",
      technicianId: technicianProfile.id,
    },
    include: { technician: { include: { user: { omit: { password: true } } } } },
  });
}

export async function updateService(
  userId: string,
  userRole: string,
  serviceId: string,
  input: UpdateServiceInput,
) {
  const service = await getServiceById(serviceId);
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (userRole !== "ADMIN" && (!profile || service.technicianId !== profile.id)) {
    throw new AppError(403, "Forbidden - You do not own this service");
  }

  return prisma.service.update({
    where: { id: serviceId },
    data: input as Prisma.ServiceUpdateInput,
    include: { technician: { include: { user: { omit: { password: true } } } } },
  });
}

export async function deleteService(userId: string, userRole: string, serviceId: string) {
  const service = await getServiceById(serviceId);
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (userRole !== "ADMIN" && (!profile || service.technicianId !== profile.id)) {
    throw new AppError(403, "Forbidden - You do not own this service");
  }

  return prisma.service.delete({ where: { id: serviceId } });
}
