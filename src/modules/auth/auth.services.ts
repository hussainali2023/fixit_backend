import status from "http-status";
import { prisma } from "../../lib/prisma";
import type { IRegisterUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import config from "../../config";
import { AppError } from "../../error/AppError";


const registerUser = async (payload: IRegisterUser) => {
  const {
    name,
    email,
    password,
    role = "CUSTOMER",
  } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_code));

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      },
    });


    return user;
  });

  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
};



export const authService = {
    registerUser
}