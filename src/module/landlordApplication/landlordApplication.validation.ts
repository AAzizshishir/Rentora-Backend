import { z } from "zod";

export const createLandlordApplicationSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  business_address: z.string().trim().min(5).max(300),
  phone: z
    .string()
    .trim()
    .regex(/^\+8801[3-9]\d{8}$/, {
      message: "Phone number must be +88 followed by a valid 11-digit Bangladesh mobile number",
    }),
  experience_years: z.number().int().min(0).max(80),
  message: z.string().trim().max(1000).optional(),
});

export const rejectLandlordApplicationSchema = z.object({
  reason: z.string().trim().min(5).max(1000),
});

export const landlordApplicationListQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  searchTerm: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateLandlordApplicationInput = z.infer<
  typeof createLandlordApplicationSchema
>;
export type RejectLandlordApplicationInput = z.infer<
  typeof rejectLandlordApplicationSchema
>;
