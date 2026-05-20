"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { ProductSelect, SupplierSelect } from "@/components/forms/entity-selects";
import { entityId } from "@/lib/validators";
import { purchaseOrderApi } from "../api/purchase-order-api";

const schema = z.object({
  supplierId: entityId("Select a supplier"),
  expectedDeliveryDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        productId: entityId("Select a product"),
        quantity: z.number().int().min(1),
        unitCost: z.number().min(0)
      })
    )
    .min(1)
});

type FormValues = z.infer<typeof schema>;

export function PurchaseOrderCreateDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      supplierId: "",
      expectedDeliveryDate: "",
      notes: "",
      items: [{ productId: "", quantity: 1, unitCost: 0 }]
    }
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  const mutation = useMutation({
    mutationFn: purchaseOrderApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase order created");
      setOpen(false);
      form.reset();
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Purchase Order</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create purchase order</DialogTitle>
          <DialogDescription>Draft a procurement order with line items and expected delivery.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
          <FormField label="Supplier" error={form.formState.errors.supplierId?.message}>
            <SupplierSelect
              value={form.watch("supplierId")}
              onChange={(value) => form.setValue("supplierId", value, { shouldValidate: true })}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Expected delivery">
              <Input type="date" {...form.register("expectedDeliveryDate")} />
            </FormField>
            <FormField label="Notes">
              <Input {...form.register("notes")} />
            </FormField>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Line items</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1, unitCost: 0 })}>
                <Plus className="h-4 w-4" />
                Add line
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-4">
                <ProductSelect
                  value={form.watch(`items.${index}.productId`)}
                  onChange={(v) => form.setValue(`items.${index}.productId`, v, { shouldValidate: true })}
                />
                <Input type="number" placeholder="Qty" {...form.register(`items.${index}.quantity`, { valueAsNumber: true })} />
                <Input type="number" step="0.01" placeholder="Unit cost" {...form.register(`items.${index}.unitCost`, { valueAsNumber: true })} />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create draft order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
