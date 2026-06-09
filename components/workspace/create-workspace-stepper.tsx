"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperSeparator,
  StepperNav,
  StepperTitle,
  StepperPanel,
  StepperContent,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import {
  workspaceInfoSchema,
  WorkspaceInfoSchema,
} from "@/lib/validations/create-workspac";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { IconX } from "@tabler/icons-react";
import { WorkspaceType } from "@/app/generated/prisma/enums";

const steps = [
  {
    id: "details",
    title: "Workspace Details",
    description: "Set your workspace name and description",
  },
  {
    id: "type",
    title: "Workspace Type",
    description: "Choose the type of workspace",
  },
  {
    id: "invites",
    title: "Invite Members",
    description: "Add teammates to collaborate",
  },
];

const workspaceTypes = [
  { label: "Personal", value: "PERSONAL" },
  { label: "Company", value: "COMPANY" },
  { label: "School", value: "SCHOOL" },
  { label: "Project", value: "PROJECT" },
] as const;

export const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type EmailSchema = z.infer<typeof emailSchema>;

export const inviteEmailsSchema = z.object({
  emails: z
    .array(z.string().email())
    .min(1, "At least one email is required")
    .max(20, "Max 20 emails allowed"),
});

export type InviteEmailsSchema = z.infer<typeof inviteEmailsSchema>;

type FormData = {
  info?: WorkspaceInfoSchema;
  type?: WorkspaceType;
  inviteEmails?: InviteEmailsSchema;
};

// Forms
const WorkspaceInfoForm = ({
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
      isPublic: false,
    },
  });

  useEffect(() => {
    // form.reset(
    //   defaultValues || { name: "", description: undefined, isPublic: false },
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

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
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
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
          name="isPublic"
          render={({ field, fieldState }) => (
            <Field className="text-start" data-invalid={fieldState.invalid}>
              <div className="flex items-center gap-3">
                <FieldLabel htmlFor="isPublic">Private Workspace</FieldLabel>
                <Switch
                  id="isPublic"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit">
          Next <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </form>
  );
};

const WorkspaceType = ({
  onNext,
  onPrev,
  defaultType,
  showPrev,
}: {
  onNext: (d: WorkspaceType) => void;
  onPrev: () => void;
  defaultType?: WorkspaceType;
  showPrev?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-3 mb-16 mt-3">
        {workspaceTypes.map((type) => {
          return (
            <Button
              key={type.value}
              size="lg"
              variant={defaultType === type.value ? "default" : "outline"}
              className="text-lg px-4 py-6 rounded-2xl cursor-pointer"
            >
              {type.label}
            </Button>
          );
        })}
      </div>
      <div className="flex justify-between gap-4">
        {showPrev !== false && (
          <Button onClick={onPrev}>
            <ArrowLeftIcon className="size-4" /> Previous
          </Button>
        )}
        {/* <Button onClick={onReset}>Reset</Button> */}
        <Button type="submit">
          Finish <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

const InviteEmails = ({
  onNext,
  onPrev,
  onReset,
  defualtInviteEmails,
  showPrev,
}: {
  onNext: (d: InviteEmailsSchema) => void;
  onPrev: () => void;
  onReset?: () => void;
  defualtInviteEmails?: InviteEmailsSchema;
  showPrev?: boolean;
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  // const [error, setError] = useState<string | null>(null);
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const hasReachedMaxEmails = emails.length >= 15;

  const onSubmit = (data: EmailSchema) => {
    // if (emails.includes(data.email)) {
    //   form.resetField("email");
    //   return;
    // }
    setEmails((prev) => [...prev, data.email]);
    form.resetField("email");
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <h3 className="text-start font-bold text-lg">
        Invite people to your Workspace:
      </h3>
      <div className="flex flex-wrap content-start gap-2 rounded-md border p-2 focus-within:ring-2 focus-within:ring-ring h-32 overscroll-y-auto overflow-x-hidden">
        {['mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
          ,'mm@mm.fdsa'
        ].map((email) => {
          return (
            <Badge key={email} className="items-center truncate" variant="outline">
              {email}
              <IconX
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("gadsf");

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
        <p className="text-destructive">{form.formState.errors.email.message}</p>
      )}
      <Button className="self-end" size="lg">
        Add
      </Button>
    </form>
  );
};

const CreateWorkspaceStepper = () => {
  const [current, setCurrent] = useState(steps[2].id);
  const [formData, setFormData] = useState<FormData>({});
  const [submitted, setSubmitted] = useState(false);
  const [validSteps, setValidSteps] = useState<Record<string, boolean>>({});

  const currentIndex = steps.findIndex((s) => s.id === current);
  const goNext = () =>
    setCurrent(steps[Math.min(currentIndex + 1, steps.length - 1)].id);
  const goBack = () => setCurrent(steps[Math.max(currentIndex - 1, 0)].id);

  const resetAll = () => {
    setFormData({});
    setCurrent(steps[0].id);
    setSubmitted(false);
    setValidSteps({});
  };

  const isCurrentValid = !!validSteps[current];

  return (
    <div className="flex items-center justify-center">
      <Stepper
        steps={steps}
        value={current}
        onValueChange={(v) => {
          if (submitted) return;
          if (!isCurrentValid && v !== current) return;
          setCurrent(v);
        }}
        className="flex flex-col items-center justify-center gap-6"
        orientation="horizontal"
      >
        <StepperNav>
          {steps.map((step, index) => (
            <StepperItem
              key={index}
              stepId={step.id}
              className="relative flex-1"
            >
              <StepperTrigger
                className={cn(
                  "flex flex-col gap-2.5",
                  submitted || !isCurrentValid ? "pointer-events-none" : "",
                )}
                aria-disabled={submitted || !isCurrentValid}
              >
                <StepperIndicator
                  className={
                    submitted
                      ? "group-data-[state=active]/step:ring-green-600/40 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-600 data-[state=completed]:bg-green-600/20 data-[state=completed]:text-green-600 dark:group-data-[state=active]/step:ring-green-400/40 dark:data-[state=completed]:bg-green-400/20 dark:data-[state=completed]:text-green-400"
                      : ""
                  }
                >
                  {index + 1}
                </StepperIndicator>
                <StepperTitle
                  className={`${submitted ? "text-muted-foreground" : ""}`}
                >
                  {step.title}
                </StepperTitle>
              </StepperTrigger>
              {steps.length > index + 1 && (
                <StepperSeparator
                  className={cn(
                    "absolute inset-x-0 top-2 right-[calc(-50%+18px)] left-[calc(50%+18px)]",
                    submitted
                      ? "group-data-[state=completed]/step:bg-green-600/20 dark:group-data-[state=completed]/step:bg-green-400/20"
                      : "",
                  )}
                />
              )}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel className="w-xs text-sm sm:w-xl">
          {steps.map((step) => (
            <StepperContent key={step.id} value={step.id}>
              <div className="flex flex-col items-center gap-4 px-8">
                <div className="w-full">
                  <div className="text-muted-foreground">
                    {step.id === "details" && (
                      <WorkspaceInfoForm
                        defaultValues={formData.info}
                        onNext={(data: WorkspaceInfoSchema) => {
                          setFormData((prev) => ({ ...prev, info: data }));
                          setValidSteps((prev) => ({ ...prev, info: true }));
                          goNext();
                        }}
                      />
                    )}

                    {step.id === "type" && (
                      <WorkspaceType
                        defaultType={formData.type}
                        onPrev={() => goBack()}
                        showPrev={!submitted}
                        onNext={(type: WorkspaceType) => {
                          setFormData((prev) => ({ ...prev, type }));
                          setValidSteps((prev) => ({ ...prev, type: true }));
                          goNext();
                        }}
                      />
                    )}

                    {step.id === "invites" && (
                      <InviteEmails
                        defualtInviteEmails={formData.inviteEmails}
                        onPrev={() => goBack()}
                        onReset={resetAll}
                        showPrev={!submitted}
                        onNext={(data: InviteEmailsSchema) => {
                          setFormData((prev) => ({ ...prev, address: data }));
                          setValidSteps((prev) => ({ ...prev, done: true }));
                          setSubmitted(true);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default CreateWorkspaceStepper;
