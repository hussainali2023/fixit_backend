import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { createTokenPair } from "../../utils/jwt";
import { AppError } from "../../utils/app-error";
import type { RegisterInput, LoginInput } from "./auth.validation";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
    },
    omit: {
      password: true,
    },
  });

  if (input.role === "TECHNICIAN") {
    await prisma.technicianProfile.create({
      data: {
        userId: user.id,
        skills: "General Technician",
        experience: 1,
        location: "Default Location",
      },
    });
  }

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  if (user.isBanned) {
    throw new AppError(403, "User account is banned");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: safeUser,
    ...createTokenPair({ email: user.email, id: user.id, role: user.role }),
  };
}
