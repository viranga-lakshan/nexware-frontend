"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { ProductSelect, WarehouseSelect } from "@/components/forms/entity-selects";
import { useWarehouseTransfer } from "../hooks/use-warehouses";

import { entityId } from "@/lib/validators";

const schema = z.object({
  productId: entityId("Select a product"),
  sourceWarehouseId: entityId("Select source warehouse"),
  destinationWarehouseId: entityId("Select destination warehouse"),
  quantity: z.number().int().min(1),
  reason: z.string().min(3).max(500)
});

type FormValues = z.infer<typeof schema>;

export function WarehouseTransferForm() {
  const transfer = useWarehouseTransfer();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: "",
      sourceWarehouseId: "",
      destinationWarehouseId: "",
      quantity: 1,
      reason: "Operational transfer"
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Transfer</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => transfer.mutate(values))}
        >
          <FormField label="Product" error={form.formState.errors.productId?.message}>
            <ProductSelect
              value={form.watch("productId")}
              onChange={(v) => form.setValue("productId", v, { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Quantity" error={form.formState.errors.quantity?.message}>
            <Input type="number" {...form.register("quantity", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Source warehouse" error={form.formState.errors.sourceWarehouseId?.message}>
            <WarehouseSelect
              value={form.watch("sourceWarehouseId")}
              onChange={(v) => form.setValue("sourceWarehouseId", v, { shouldValidate: true })}
              placeholder="Source"
            />
          </FormField>
          <FormField label="Destination warehouse" error={form.formState.errors.destinationWarehouseId?.message}>
            <WarehouseSelect
              value={form.watch("destinationWarehouseId")}
              onChange={(v) => form.setValue("destinationWarehouseId", v, { shouldValidate: true })}
              placeholder="Destination"
            />
          </FormField>
          <FormField label="Reason" className="md:col-span-2" error={form.formState.errors.reason?.message}>
            <Input {...form.register("reason")} />
          </FormField>
          <Button className="md:col-span-2" disabled={transfer.isPending}>
            {transfer.isPending ? "Transferring..." : "Transfer Stock"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
