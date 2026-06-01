"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { ASSIGNABLE_ROLES, type ManagedUser, type RoleName } from "@/types/domain";
import { useUpdateUser } from "../hooks/use-users";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  enabled: z.boolean(),
  accountLocked: z.boolean(),
  roles: z.array(z.string()).min(1, "Select at least one role")
});

type FormValues = z.infer<typeof schema>;

interface UserEditDialogProps {
  user: ManagedUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  const update = useUpdateUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      enabled: true,
      accountLocked: false,
      roles: []
    }
  });

  useEffect(() => {
    if (!user || !open) return;
    const roles = user.roles.filter((r) => ASSIGNABLE_ROLES.includes(r));
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber ?? "",
      enabled: user.enabled,
      accountLocked: user.accountLocked,
      roles: roles.length > 0 ? roles : [user.roles[0]]
    });
  }, [user, open, form]);

  const toggleRole = (role: RoleName, checked: boolean) => {
    const current = form.getValues("roles") as RoleName[];
    const next = checked ? [...current, role] : current.filter((r) => r !== role);
    form.setValue("roles", next, { shouldValidate: true });
  };

  const onSubmit = form.handleSubmit((values) => {
    if (!user) return;
    update.mutate(
      {
        id: user.id,
        payload: {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber || undefined,
          enabled: values.enabled,
          accountLocked: values.accountLocked,
          roles: values.roles as RoleName[]
        }
      },
      { onSuccess: () => onOpenChange(false) }
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>{user?.email}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="First name" error={form.formState.errors.firstName?.message}>
              <Input {...form.register("firstName")} />
            </FormField>
            <FormField label="Last name" error={form.formState.errors.lastName?.message}>
              <Input {...form.register("lastName")} />
            </FormField>
          </div>
          <FormField label="Phone">
            <Input {...form.register("phoneNumber")} />
          </FormField>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("enabled")} />
              Account enabled
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("accountLocked")} />
              Account locked
            </label>
          </div>
          <FormField label="Roles" error={form.formState.errors.roles?.message}>
            <div className="grid gap-2 sm:grid-cols-2">
              {ASSIGNABLE_ROLES.map((role) => (
                <label key={role} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.watch("roles")?.includes(role)}
                    onCheckedChange={(checked) => toggleRole(role, Boolean(checked))}
                  />
                  {role.replaceAll("_", " ")}
                </label>
              ))}
            </div>
          </FormField>
          <DialogFooter>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
