"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowLeft, IconRocket, IconX } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { emailSchema, EmailSchema } from "@/lib/validations/email";
import { InviteEmailsSchema } from "@/lib/validations/workspace";
import { Spinner } from "@/components/ui/spinner";

export const InviteEmailsForm = ({
  onFinish,
  onPrev,
  defualtInviteEmails,
  showPrev,
  isLoading,
}: {
  onFinish: (emails: InviteEmailsSchema) => Promise<void>;
  onPrev: (data: InviteEmailsSchema) => void;
  defualtInviteEmails?: InviteEmailsSchema;
  showPrev?: boolean;
  isLoading: boolean;
}) => {
  const [emails, setEmails] = useState<string[]>(
    defualtInviteEmails?.emails || [],
  );
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const hasReachedMaxEmails = emails.length >= 15;

  const onSubmit = (data: EmailSchema) => {
    if (emails.includes(data.email)) {
      form.resetField("email");
      return;
    }
    setEmails((prev) => [...prev, data.email]);
    form.resetField("email");
  };

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <h3 className="font-bold sm:text-lg">
          Invite people to your Workspace:
        </h3>
        <div className="flex flex-wrap content-start gap-2 rounded-md border p-2 focus-within:ring-2 focus-within:ring-ring min-h-32 overscroll-y-auto overflow-x-hidden">
          {emails.map((email) => {
            return (
              <Badge
                key={email}
                className="items-center truncate"
                variant="outline"
              >
                {email}
                <IconX
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEmails((prev) => {
                      return prev.filter((e) => e === email);
                    });
                  }}
                />
              </Badge>
            );
          })}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                className="flex-1  w-auto  min-w-40 p-1"
                data-invalid={fieldState.invalid}
              >
                <input
                  {...field}
                  id="email"
                  placeholder={
                    hasReachedMaxEmails
                      ? "You can invite up to 15 people."
                      : "Enter email"
                  }
                  aria-invalid={fieldState.invalid}
                  disabled={hasReachedMaxEmails}
                  className="flex-1 min-w-30 bg-transparent outline-none"
                />
              </Field>
            )}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
        <Button className="self-end cursor-pointer" size="lg">
          Add
        </Button>
      </form>
      <div className="flex justify-between items-center gap-4">
        {showPrev !== false && (
          <Button onClick={() => onPrev({ emails })} className="cursor-pointer">
            <IconArrowLeft /> Previous
          </Button>
        )}
        <Button
          className="cursor-pointer ml-auto"
          onClick={() => {
            onFinish({ emails });
          }}
        >
          {isLoading ? <Spinner /> : <IconRocket />}
          Finish
        </Button>
      </div>
    </div>
  );
};
