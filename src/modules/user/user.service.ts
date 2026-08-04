import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { Role } from "../../../prisma/generated/prisma/enums";

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  });
}

export async function updateUserStatus(
  userId: string,
  data: { isBanned?: boolean; role?: Role },
) {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new AppError(404, "User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    omit: { password: true },
    include: { technicianProfile: true },
  });
}
