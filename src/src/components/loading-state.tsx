"use client";

import { useEffect, useState } from "react";
import { Rocket, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LOADING_MESSAGES } from "@/lib/utils";

const STEP_DURATION = 3500;

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = LOADING_MESSAGES.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < totalSteps - 1 ? prev + 1 : prev
      );
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, [totalSteps]);

  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border bg-card">
        <CardContent className="py-10 px-8 space-y-8">
          {/* Animated rocket icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-primary animate-bounce" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-foreground">
                Evaluating your idea...
              </span>
              <span className="font-mono text-primary font-bold">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-2.5">
            {LOADING_MESSAGES.map((message, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const isPending = index > currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-500 ${
                    isActive
                      ? "bg-primary/10 text-foreground font-medium"
                      : isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/40"
                  }`}
                >
                  {/* Step indicator */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : isActive ? (
                      <div className="h-4 w-4 rounded-full border-2 border-primary relative">
                        <div className="absolute inset-0.5 rounded-full bg-primary animate-pulse" />
                      </div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>

                  <span>{message}</span>
                </div>
              );
            })}
          </div>

          {/* Time estimate */}
          <p className="text-center text-xs text-muted-foreground pt-2">
            This typically takes 15-30 seconds
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
