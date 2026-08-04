import { z } from "zod";

export const updateProfileSchema = z.object({
  skills: z.string().trim().min(1).optional(),
  experience: z.number().nonnegative().optional(),
  location: z.string().trim().min(1).optional(),
  availability: z.string().trim().min(1).optional(),
});

export const updateAvailabilitySchema = z.object({
  availability: z.string().trim().min(1, "availability is required"),
});

export const technicianIdParamSchema = z.object({
  id: z.uuid("invalid technician id"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
