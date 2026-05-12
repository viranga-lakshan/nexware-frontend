"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { ProductSelect, WarehouseSelect } from "@/components/forms/entity-selects";
import { stockAdjustmentSchema } from "../schemas/inventory-schemas";
import { useStockAdjustment } from "../hooks/use-inventory";

type FormValues = z.infer<typeof stockAdjustmentSchema>;

export function StockAdjustmentForm() {
  const mutation = useStockAdjustment();
  const form = useForm<FormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      warehouseId: "",
      productId: "",
      newQuantityOnHand: 0,
      unitCost: undefined,
      reason: "Cycle count reconciliation"
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Adjustment</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FormField label="Warehouse" error={form.formState.errors.warehouseId?.message}>
            <WarehouseSelect
              value={form.watch("warehouseId")}
              onChange={(value) => form.setValue("warehouseId", value, { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Product" error={form.formState.errors.productId?.message}>
            <ProductSelect
              value={form.watch("productId")}
              onChange={(value) => form.setValue("productId", value, { shouldValidate: true })}
            />
          </FormField>
          <FormField label="New quantity on hand" error={form.formState.errors.newQuantityOnHand?.message}>
            <Input type="number" {...form.register("newQuantityOnHand", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Unit cost (optional)" error={form.formState.errors.unitCost?.message}>
            <Input type="number" step="0.01" {...form.register("unitCost", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Reason" className="md:col-span-2" error={form.formState.errors.reason?.message}>
            <Input {...form.register("reason")} />
          </FormField>
          <Button className="md:col-span-2" disabled={mutation.isPending}>
            {mutation.isPending ? "Applying..." : "Apply Adjustment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
