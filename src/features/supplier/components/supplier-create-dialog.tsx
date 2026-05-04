"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { supplierApi } from "../api/supplier-api";
import { supplierCreateSchema } from "../schemas/supplier-schemas";

type FormValues = z.infer<typeof supplierCreateSchema>;

export function SupplierCreateDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(supplierCreateSchema),
    defaultValues: {
      code: "",
      legalName: "",
      displayName: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      address: "",
      taxIdentifier: ""
    }
  });

  const mutation = useMutation({
    mutationFn: supplierApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier created");
      setOpen(false);
      form.reset();
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Supplier</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create supplier</DialogTitle>
          <DialogDescription>Register a procurement partner for purchase orders and product mapping.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
          <FormField label="Code" error={form.formState.errors.code?.message}>
            <Input {...form.register("code")} />
          </FormField>
          <FormField label="Display name" error={form.formState.errors.displayName?.message}>
            <Input {...form.register("displayName")} />
          </FormField>
          <FormField label="Legal name" className="sm:col-span-2" error={form.formState.errors.legalName?.message}>
            <Input {...form.register("legalName")} />
          </FormField>
          <FormField label="Contact person">
            <Input {...form.register("contactPerson")} />
          </FormField>
          <FormField label="Email" error={form.formState.errors.email?.message}>
            <Input type="email" {...form.register("email")} />
          </FormField>
          <FormField label="Phone">
            <Input {...form.register("phoneNumber")} />
          </FormField>
          <FormField label="Tax ID">
            <Input {...form.register("taxIdentifier")} />
          </FormField>
          <FormField label="Address" className="sm:col-span-2">
            <Input {...form.register("address")} />
          </FormField>
          <DialogFooter className="sm:col-span-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
