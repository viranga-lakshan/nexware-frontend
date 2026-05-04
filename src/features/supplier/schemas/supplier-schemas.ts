import { z } from "zod";

export const supplierCreateSchema = z.object({
  code: z.string().min(1).max(40),
  legalName: z.string().min(1).max(180),
  displayName: z.string().min(1).max(180),
  contactPerson: z.string().max(140).optional(),
  email: z.union([z.string().email(), z.literal("")]).optional(),
  phoneNumber: z.string().max(32).optional(),
  address: z.string().max(500).optional(),
  taxIdentifier: z.string().max(80).optional()
});
