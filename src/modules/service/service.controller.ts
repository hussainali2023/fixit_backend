import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import prisma from "../../lib/prisma";
import {
  createServiceSchema,
  serviceIdParamSchema,
  updateServiceSchema,
} from "./service.validation";
import {
  createService,
  deleteService,
  getServiceById,
  updateService,
} from "./service.service";

export const getServices = catchAsync(async (req: Request, res: Response) => {
  const category = (req.query.category ?? req.query.categoryId) as string | undefined;
  const search = (req.query.search ?? req.query.searchTerm) as string | undefined;
  const location = req.query.location as string | undefined;

  const where: any = {};

  if (category) {
    where.category = { contains: category, mode: "insensitive" };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  if (location) {
    where.technician = {
      location: { contains: location, mode: "insensitive" },
    };
  }

  const services = await prisma.service.findMany({
    where,
    include: {
      technician: { include: { user: { omit: { password: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Services retrieved successfully",
    data: { services },
  });
});

export const getService = catchAsync(async (req: Request, res: Response) => {
  const { id } = serviceIdParamSchema.parse(req.params);

  const service = await getServiceById(id);

  sendResponse(res, {
    message: "Service retrieved successfully",
    data: { service },
  });
});

export const addService = catchAsync(async (req: Request, res: Response) => {
  const input = createServiceSchema.parse(req.body);

  const service = await createService(req.user!.id, input);

  sendResponse(
    res,
    { message: "Service created successfully", data: { service } },
    201,
  );
});

export const editService = catchAsync(async (req: Request, res: Response) => {
  const { id } = serviceIdParamSchema.parse(req.params);
  const input = updateServiceSchema.parse(req.body);

  const service = await updateService(req.user!.id, req.user!.role, id, input);

  sendResponse(res, {
    message: "Service updated successfully",
    data: { service },
  });
});

export const removeService = catchAsync(async (req: Request, res: Response) => {
  const { id } = serviceIdParamSchema.parse(req.params);

  await deleteService(req.user!.id, req.user!.role, id);

  sendResponse(res, { message: "Service deleted successfully" });
});
