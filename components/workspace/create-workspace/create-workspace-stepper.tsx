"use client";

import { useState, useTransition } from "react";

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { createWorkspace as createWorkspaceServer } from "@/lib/actions/workspace/create-workspace.action";
import { cn } from "@/lib/utils";
import {
  CreateWorkspaceSchema,
  InviteEmailsSchema,
  WorkspaceInfoSchema,
} from "@/lib/validations/workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InviteEmailsForm } from "./invite-emails-form";
import { WorkspaceInfoForm } from "./workspace-info-form";
import { WorkspaceTypeForm } from "./workspace-type-form";

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

export type WorkspaceType = CreateWorkspaceSchema["type"];

type FormData = {
  info?: WorkspaceInfoSchema;
  type?: WorkspaceType;
  inviteEmails?: InviteEmailsSchema;
};

const CreateWorkspaceStepper = () => {
  const [current, setCurrent] = useState(steps[0].id);
  const [formData, setFormData] = useState<FormData>({});
  const [submitted, setSubmitted] = useState(false);
  const [validSteps, setValidSteps] = useState<Record<string, boolean>>({});

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const createWorkspaae = async (data: CreateWorkspaceSchema) =>
    startTransition(async () => {
      setSubmitted(true);

      const res = await createWorkspaceServer(data);

      if (res.error) {
        setSubmitted(false);
        toast.error(
          res.error.message || "Something went wrong, please try again later",
        );
      }

      toast.success("workspace is created sucsssfully");
      router.push(`/workspace/${res.data?.workspace.id}`);
    });

  const currentIndex = steps.findIndex((s) => s.id === current);
  const goNext = () =>
    setCurrent(steps[Math.min(currentIndex + 1, steps.length - 1)].id);
  const goBack = () => setCurrent(steps[Math.max(currentIndex - 1, 0)].id);

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
                  className={`${submitted ? "text-muted-foreground" : ""} max-sm:text-xs`}
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
                      <WorkspaceTypeForm
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
                      <InviteEmailsForm
                        defualtInviteEmails={formData.inviteEmails}
                        onPrev={(emails: InviteEmailsSchema) => {
                          setFormData((prev) => ({
                            ...prev,
                            inviteEmails: emails,
                          }));
                          goBack();
                        }}
                        showPrev={!submitted}
                        onFinish={async (emails: InviteEmailsSchema) => {
                          if (!formData.info?.name || !formData.type) {
                            toast.error("Please add nassery filds");
                            return;
                          }
                          setSubmitted(true);

                          const data: CreateWorkspaceSchema = {
                            ...formData.info,
                            type: formData.type || "PERSONAL",
                            emails: emails.emails || [],
                          };

                          await createWorkspaae(data);
                        }}
                        isLoading={isPending}
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
