import { z } from "zod";
import { entityId } from "@/lib/validators";

export const productCreateSchema = z.object({
  categoryId: entityId("Select a category"),
  sku: z.string().min(1, "SKU is required").max(80),
  barcode: z.string().max(128).optional(),
  name: z.string().min(1, "Name is required").max(180),
  description: z.string().optional(),
  brand: z.string().max(120).optional(),
  model: z.string().max(120).optional(),
  unitCost: z.number().min(0),
  unitPrice: z.number().min(0),
  lowStockThreshold: z.number().int().min(0),
  trackSerialNumbers: z.boolean(),
  supplierIds: z.array(entityId()).optional()
});
