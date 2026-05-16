"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { ProductSelect, WarehouseSelect } from "@/components/forms/entity-selects";
import { useCreateReservation } from "../hooks/use-reservations";

import { entityId } from "@/lib/validators";

const schema = z.object({
  warehouseId: entityId("Select a warehouse"),
  productId: entityId("Select a product"),
  quantity: z.number().int().min(1),
  expirationMinutes: z.number().int().min(1).optional()
});

type FormValues = z.infer<typeof schema>;

export function ReservationForm() {
  const create = useCreateReservation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { warehouseId: "", productId: "", quantity: 1, expirationMinutes: 30 }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Reservation</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((values) => create.mutate(values))}
        >
          <FormField label="Warehouse" error={form.formState.errors.warehouseId?.message}>
            <WarehouseSelect
              value={form.watch("warehouseId")}
              onChange={(v) => form.setValue("warehouseId", v, { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Product" error={form.formState.errors.productId?.message}>
            <ProductSelect
              value={form.watch("productId")}
              onChange={(v) => form.setValue("productId", v, { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Quantity" error={form.formState.errors.quantity?.message}>
            <Input type="number" {...form.register("quantity", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Expiration (minutes)" error={form.formState.errors.expirationMinutes?.message}>
            <Input type="number" {...form.register("expirationMinutes", { valueAsNumber: true })} />
          </FormField>
          <Button className="md:col-span-2" disabled={create.isPending}>
            {create.isPending ? "Reserving..." : "Reserve Stock"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
