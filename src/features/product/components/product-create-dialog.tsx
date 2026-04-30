"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { CategorySelect, SupplierSelect } from "@/components/forms/entity-selects";
import { productApi } from "../api/product-api";
import { productCreateSchema } from "../schemas/product-schemas";

type FormValues = z.infer<typeof productCreateSchema>;

export function ProductCreateDialog() {
  const [open, setOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      categoryId: "",
      sku: "",
      barcode: "",
      name: "",
      brand: "",
      model: "",
      unitCost: 0,
      unitPrice: 0,
      lowStockThreshold: 5,
      trackSerialNumbers: false
    }
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      productApi.create({
        ...values,
        supplierIds: supplierId ? [supplierId] : []
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created");
      setOpen(false);
      form.reset();
      setSupplierId("");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create product</DialogTitle>
          <DialogDescription>Add a catalog item with category, pricing, and supplier mapping.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
          <FormField label="Category" error={form.formState.errors.categoryId?.message}>
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <CategorySelect
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select category"
                />
              )}
            />
          </FormField>
          <FormField label="SKU" error={form.formState.errors.sku?.message}>
            <Input {...form.register("sku")} />
          </FormField>
          <FormField label="Barcode" error={form.formState.errors.barcode?.message}>
            <Input {...form.register("barcode")} />
          </FormField>
          <FormField label="Name" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} />
          </FormField>
          <FormField label="Brand" error={form.formState.errors.brand?.message}>
            <Input {...form.register("brand")} />
          </FormField>
          <FormField label="Model" error={form.formState.errors.model?.message}>
            <Input {...form.register("model")} />
          </FormField>
          <FormField label="Unit cost" error={form.formState.errors.unitCost?.message}>
            <Input type="number" step="0.01" {...form.register("unitCost", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Unit price" error={form.formState.errors.unitPrice?.message}>
            <Input type="number" step="0.01" {...form.register("unitPrice", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Low stock threshold" error={form.formState.errors.lowStockThreshold?.message}>
            <Input type="number" {...form.register("lowStockThreshold", { valueAsNumber: true })} />
          </FormField>
          <FormField label="Supplier mapping">
            <SupplierSelect value={supplierId} onChange={setSupplierId} placeholder="Optional supplier" />
          </FormField>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" {...form.register("trackSerialNumbers")} />
            Track serial numbers
          </label>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
