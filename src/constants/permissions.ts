import type { RoleName } from "@/types/domain";

/** Matches InventoryController GET /inventory/valuation */
export const INVENTORY_VALUATION_ROLES: RoleName[] = [
  "ADMIN",
  "WAREHOUSE_MANAGER",
  "PROCUREMENT_OFFICER"
];

export function canViewInventoryValuation(roles: RoleName[]) {
  return roles.some((role) => INVENTORY_VALUATION_ROLES.includes(role));
}
