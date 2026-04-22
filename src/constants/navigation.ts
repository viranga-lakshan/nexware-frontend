import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ClipboardList,
  FileText,
  Gauge,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users
} from "lucide-react";
import type { RoleName } from "@/types/domain";

export const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Gauge,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_STAFF", "PROCUREMENT_OFFICER"] as RoleName[]
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_STAFF", "PROCUREMENT_OFFICER"] as RoleName[]
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Boxes,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_STAFF", "PROCUREMENT_OFFICER"] as RoleName[]
  },
  {
    title: "Warehouses",
    href: "/warehouses",
    icon: Building2,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_STAFF", "PROCUREMENT_OFFICER"] as RoleName[]
  },
  {
    title: "Reservations",
    href: "/reservations",
    icon: ClipboardList,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_STAFF"] as RoleName[]
  },
  {
    title: "Purchase Orders",
    href: "/purchase-orders",
    icon: ShoppingCart,
    roles: ["ADMIN", "PROCUREMENT_OFFICER", "WAREHOUSE_MANAGER"] as RoleName[]
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
    roles: ["ADMIN", "PROCUREMENT_OFFICER", "WAREHOUSE_MANAGER"] as RoleName[]
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_STAFF", "PROCUREMENT_OFFICER"] as RoleName[]
  },
  {
    title: "Audit Logs",
    href: "/audit",
    icon: FileText,
    roles: ["ADMIN"] as RoleName[]
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: ["ADMIN"] as RoleName[]
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "PROCUREMENT_OFFICER"] as RoleName[]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "INVENTORY_STAFF", "PROCUREMENT_OFFICER"] as RoleName[]
  }
];
