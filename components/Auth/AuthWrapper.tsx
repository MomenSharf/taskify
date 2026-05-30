"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

export function AuthWrapper({
  children,
  icon,
  imgUrl,
  className,
  ...props
}: {
  children: ReactNode;
  icon?: ReactNode;
  imgUrl: string;
} & React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("errorMessage");

  useEffect(() => {
    if (!errorMessage) return;

    const t = setTimeout(() => {
      toast.error(errorMessage);
    }, 50);

    return () => clearTimeout(t);
  }, [errorMessage]);
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col gap-1 px-6 py-4 md:px-8">
            {icon && (
              <div className="flex justify-center">
                <div className="p-2 border rounded-md">{icon}</div>
              </div>
            )}
            <div>{children}</div>
          </div>
          <div className="relative hidden bg-muted md:block ">
            <Image
              src={imgUrl}
              alt="Signin"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
