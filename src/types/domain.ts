export type RoleName = "ADMIN" | "WAREHOUSE_MANAGER" | "INVENTORY_STAFF" | "PROCUREMENT_OFFICER" | "SUPPLIER";

export const ASSIGNABLE_ROLES: RoleName[] = [
  "ADMIN",
  "WAREHOUSE_MANAGER",
  "INVENTORY_STAFF",
  "PROCUREMENT_OFFICER"
];

export interface ManagedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  enabled: boolean;
  accountLocked: boolean;
  roles: RoleName[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
export type PurchaseOrderStatus = "DRAFT" | "APPROVED" | "REJECTED" | "RECEIVED";
export type ReservationStatus = "ACTIVE" | "RELEASED" | "EXPIRED";
export type StockMovementType =
  | "ADJUSTMENT"
  | "TRANSFER_OUT"
  | "TRANSFER_IN"
  | "RESERVATION"
  | "RELEASE"
  | "PURCHASE_RECEIPT"
  | "SALE";

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface SupplierSummary {
  id: string;
  code: string;
  displayName: string;
}

export interface Product {
  id: string;
  category?: ProductCategory;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  unitCost: number;
  unitPrice: number;
  lowStockThreshold: number;
  trackSerialNumbers: boolean;
  active: boolean;
  suppliers?: SupplierSummary[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface InventoryItem {
  id: string;
  warehouseId: string;
  warehouseCode: string;
  productId: string;
  sku: string;
  productName: string;
  locationId?: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  averageUnitCost: number;
  inventoryValue: number;
  lowStock: boolean;
  updatedAt: string;
  version: number;
}

export interface InventoryValuation {
  totalValue: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  sku: string;
  sourceWarehouseId?: string;
  destinationWarehouseId?: string;
  movementType: StockMovementType;
  quantity: number;
  unitCost: number;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
  occurredAt: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  capacityUnits: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Supplier {
  id: string;
  code: string;
  legalName: string;
  displayName: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  taxIdentifier?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Reservation {
  id: string;
  reservationReference: string;
  inventoryId: string;
  warehouseId: string;
  productId: string;
  sku: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: string;
  releasedAt?: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  expectedDeliveryDate?: string;
  rejectedReason?: string;
  notes?: string;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  approvedAt?: string;
  receivedAt?: string;
  items: PurchaseOrderItem[];
}

export interface Notification {
  id: string;
  type: string;
  status: string;
  title: string;
  message: string;
  payload?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorType: string;
  action: string;
  aggregateType: string;
  requestId: string;
  ipAddress: string;
  userAgent: string;
  metadata?: string;
  createdAt: string;
}
