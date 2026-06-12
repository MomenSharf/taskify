"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  IconArrowLeft,
  IconArrowRight
} from "@tabler/icons-react";
import { WorkspaceType } from "./create-workspace-stepper";

const workspaceTypes = [
  { label: "Personal", value: "PERSONAL" },
  { label: "Company", value: "COMPANY" },
  { label: "School", value: "SCHOOL" },
  { label: "Project", value: "PROJECT" },
] as const;


export const WorkspaceTypeForm = ({
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
  const [type, setType] = useState<WorkspaceType | undefined>(defaultType);
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-start font-bold sm:text-lg">
        What will you use this Workspace for?
      </h3>
      <div className="flex flex-wrap gap-3 mb-16 mt-3">
        {workspaceTypes.map((t) => {
          return (
            <Button
              key={t.value}
              size="lg"
              variant={type === t.value ? "default" : "outline"}
              className="sm:text-lg px-4 py-6 rounded-2xl cursor-pointer"
              onClick={() => {
                setType(t.value);
                onNext(t.value);
              }}
            >
              {t.label}
            </Button>
          );
        })}
      </div>
      <div className="flex justify-between gap-4">
        {showPrev !== false && (
          <Button onClick={onPrev} className="cursor-pointer">
            <IconArrowLeft /> Previous
          </Button>
        )}
        <Button
          type="submit"
          disabled={!type}
          onClick={() => {
            if (type) onNext(type);
          }}
          className="cursor-pointer"
        >
          Next <IconArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};