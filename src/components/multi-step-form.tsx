import { Check, X, Loader2 } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  number: number;
}

interface MultiStepFormProps {
  title: string;
  steps: Step[];
  currentStep: number;
  onClose: () => void;
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLoading?: boolean;
  nextButtonText?: string;
}

export default function MultiStepForm({
  title,
  steps,
  currentStep,
  onClose,
  children,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
  isLoading = false,
  nextButtonText,
}: MultiStepFormProps) {
  const currentStepIndex = currentStep - 1;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [currentStep]);

  return (
    <div className="bg-background min-h-[80vh] p-2">
      <Card className="border border-white/50">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </CardHeader>

        {/* step indicator */}
        <CardContent className="border-b py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "relative flex items-center",
                  index < steps.length - 1 && "flex-1",
                )}
              >
                <div className="relative z-10 flex shrink-0 flex-col items-center gap-2">
                  <div
                    className={cn(
                      "bg-background relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200",
                      index === currentStepIndex
                        ? "border-gray-600 bg-white text-black"
                        : index < currentStepIndex
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-muted-foreground/30 bg-muted text-muted-foreground",
                    )}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-medium md:block",
                      index === currentStepIndex
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-10 h-px w-full border-t transition-colors",
                      index < currentStepIndex
                        ? "border-secondary border-solid"
                        : "border-muted-foreground/30 border-dotted",
                    )}
                    style={{
                      borderTopWidth: "2px",
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>

        {/* form content */}
        <CardContent className="py-4">{children}</CardContent>

        {/* navigation buttons */}
        <CardContent className="flex items-center justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious || currentStep === 1 || isLoading}
            className="cursor-pointer"
          >
            Sebelumnya
          </Button>
          <Button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className="cursor-pointer border border-black bg-black text-white transition-colors duration-200 hover:bg-white hover:text-black"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {` `}
                Menyimpan...
              </>
            ) : (
              (nextButtonText ?? "Berikutnya")
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
