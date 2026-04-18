"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthCard } from "@/components/layout/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  return (
    <AuthCard
      title="Recover access"
      description="Password reset will be enabled when the backend reset endpoint is available."
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(() => {
          toast.info("Password reset is not yet available on the API", {
            description: "Contact your administrator or use a seeded demo account."
          });
        })}
      >
        <FormField label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" placeholder="admin@nexware.lk" {...form.register("email")} />
        </FormField>
        <Button className="w-full" type="submit">
          Request reset link
        </Button>
        <Link className="block text-center text-sm text-primary" href="/login">
          Back to login
        </Link>
      </form>
    </AuthCard>
  );
}
