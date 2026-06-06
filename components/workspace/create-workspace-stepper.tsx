"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
  InviteEmailsSchema,
  workspaceInfoSchema,
  WorkspaceInfoSchema,
} from "@/lib/validations/create-workspac";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
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

const addressSchema = z.object({
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
});

type Address = z.infer<typeof addressSchema>;

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
  defaultValues: WorkspaceInfoSchema;
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

const AddressForm = ({
  onNext,
  onPrev,
  onReset,
  defaultValues,
  showPrev,
}: {
  onNext: (d: Address) => void;
  onPrev: () => void;
  onReset?: () => void;
  defaultValues?: Address;
  showPrev?: boolean;
}) => {
  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || { street: "", city: "", zipCode: "" },
  });

  useEffect(() => {
    form.reset(defaultValues || { street: "", city: "", zipCode: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="street"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="text-start">
              <FieldLabel htmlFor="street">Street</FieldLabel>
              <Input
                {...field}
                id="street"
                placeholder="123 Main St"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="text-start">
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input
                {...field}
                id="city"
                placeholder="New York"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="zipCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="text-start">
              <FieldLabel htmlFor="zipCode">ZIP Code</FieldLabel>
              <Input
                {...field}
                id="zipCode"
                placeholder="10001"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-4">
        {showPrev !== false && (
          <Button onClick={onPrev}>
            <ArrowLeftIcon className="size-4" /> Previous
          </Button>
        )}
        <Button onClick={onReset}>Reset</Button>
        <Button type="submit">
          Finish <ArrowRightIcon className="size-4" />
        </Button>
      </div>
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
        <StepperPanel className="w-xs text-center text-sm sm:w-xl">
          {steps.map((step) => (
            <StepperContent key={step.id} value={step.id}>
              <div className="flex flex-col items-center gap-4 px-8">
                <div className="w-full">
                  <div className="text-muted-foreground">
                    {step.id === "details" && (
                      <WorkspaceInfoForm
                        defaultValues={formData.info}
                        onNext={(data: WorkspaceInfoSchema) => {
                          setFormData((prev) => ({ ...prev, personal: data }));
                          setValidSteps((prev) => ({ ...prev, details: true }));
                          goNext();
                        }}
                      />
                    )}

                    {step.id === "type" && (
                      <WorkspaceType
                        defaultValues={formData.contact}
                        onPrev={() => goBack()}
                        showPrev={!submitted}
                        onNext={(data: ContactInfo) => {
                          setFormData((prev) => ({ ...prev, contact: data }));
                          setValidSteps((prev) => ({ ...prev, review: true }));
                          goNext();
                        }}
                      />
                    )}

                    {step.id === "invites" && (
                      <AddressForm
                        defaultValues={formData.address}
                        onPrev={() => goBack()}
                        onReset={resetAll}
                        showPrev={!submitted}
                        onNext={(data: Address) => {
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
