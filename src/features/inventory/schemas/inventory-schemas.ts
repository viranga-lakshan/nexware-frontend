import { z } from "zod";
import { entityId } from "@/lib/validators";

export const stockAdjustmentSchema = z.object({
  warehouseId: entityId("Select a warehouse"),
  productId: entityId("Select a product"),
  newQuantityOnHand: z.number().int().min(0),
  unitCost: z.number().min(0).optional(),
  reason: z.string().min(3).max(500)
});
