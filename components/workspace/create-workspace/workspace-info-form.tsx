"use client";


import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowRight
} from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  workspaceInfoSchema,
  WorkspaceInfoSchema
} from "@/lib/validations/workspace";

export const  WorkspaceInfoForm = ({
  onNext,
  defaultValues,
}: {
  onNext: (d: WorkspaceInfoSchema) => void;
  defaultValues?: WorkspaceInfoSchema;
}) => {
  const form = useForm<WorkspaceInfoSchema>({
    resolver: zodResolver(workspaceInfoSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      isPrivate: false,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="firstName">Workspac Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="What should we call your workspace?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="text-start">
              <FieldLabel htmlFor="lastName">
                Description {"(Optional)"}
              </FieldLabel>
              <Textarea
                {...field}
                id="ddescription"
                placeholder="Doe"
                aria-invalid={fieldState.invalid}
                className="resize-none h-28"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="isPrivate"
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-3">
                <FieldLabel htmlFor="isPublic">Private Workspace</FieldLabel>
                <Switch
                  id="isPrivate"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="cursor-pointer"
                />
              </div>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" className="cursor-pointer">
          Next <IconArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
