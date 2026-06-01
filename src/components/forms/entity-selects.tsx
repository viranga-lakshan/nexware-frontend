"use client";

import { Select } from "@/components/ui/select";
import { useProducts } from "@/features/product/hooks/use-products";
import { useSuppliers } from "@/features/supplier/hooks/use-suppliers";
import { useWarehouses } from "@/features/warehouse/hooks/use-warehouses";
import { useProductCategories } from "@/features/product/hooks/use-products";

interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function WarehouseSelect({ value, onChange, placeholder = "Select warehouse" }: SelectProps) {
  const { data } = useWarehouses({ size: 200 });
  return (
    <Select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {(data?.content ?? []).map((warehouse) => (
        <option key={warehouse.id} value={warehouse.id}>
          {warehouse.code} — {warehouse.name}
        </option>
      ))}
    </Select>
  );
}

export function ProductSelect({ value, onChange, placeholder = "Select product" }: SelectProps) {
  const { data } = useProducts({ size: 200 });
  return (
    <Select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {(data?.content ?? []).map((product) => (
        <option key={product.id} value={product.id}>
          {product.sku} — {product.name}
        </option>
      ))}
    </Select>
  );
}

export function SupplierSelect({ value, onChange, placeholder = "Select supplier" }: SelectProps) {
  const { data } = useSuppliers({ size: 200 });
  return (
    <Select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {(data?.content ?? []).map((supplier) => (
        <option key={supplier.id} value={supplier.id}>
          {supplier.code} — {supplier.displayName}
        </option>
      ))}
    </Select>
  );
}

export function CategorySelect({ value, onChange, placeholder = "All categories" }: SelectProps) {
  const { data } = useProductCategories();
  return (
    <Select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {(data ?? []).map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </Select>
  );
}
