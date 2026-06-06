import { cn } from "@/lib/utils";
import { IconCheckbox, IconPointerCollaboration, IconSparkles, IconSphere2 } from "@tabler/icons-react";
import { Button } from "./button";
import { Icons } from "../Icons";

type LogoVariant = "icon" | "text" | "both";

type LogoProps = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text?: string;
  iconSize?: number;
  variant?: LogoVariant;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
};

export function Logo({
  icon,
  text = "Taskify",
  iconSize = 28,
  variant = "both",
  className,
  iconClassName,
  textClassName,
}: LogoProps) {
  const Icon = icon ?? Icons.logo;

  const buttonSize = iconSize + 16;
  const px = `${iconSize}px`;

  return (
    <div className={cn("flex items-center gap-2 font-semibold", className)}>
      {(variant === "icon" || variant === "both") && (
        <Button
          className="flex items-center justify-center p-0"
          style={{
            width: buttonSize,
            height: buttonSize,
          }}
        >
          <Icon
            className={iconClassName}
            style={{
              width: px,
              height: px,
            }}
          />
        </Button>
      )}

      {(variant === "text" || variant === "both") && (
        <span className={cn("text-lg tracking-tight", textClassName)}>
          {text}
        </span>
      )}
    </div>
  );
}