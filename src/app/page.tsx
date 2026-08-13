"use client";

import { useState, useEffect } from "react";
import { IdeaForm } from "@/components/idea-form";
import { ResultsDashboard } from "@/components/results-dashboard";
import { LoadingState } from "@/components/loading-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import type { IdeaFormData, EvaluationResponse, EvaluationState } from "@/lib/types";

export default function HomePage() {
  const [state, setState] = useState<EvaluationState>({ status: "idle" });

  useEffect(() => {
    if (state.status === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  const handleSubmit = async (formData: IdeaFormData) => {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Evaluation failed (${response.status})`
        );
      }

      const data: EvaluationResponse = await response.json();
      setState({ status: "success", data });
    } catch (error) {
      setState({
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6 md:px-24 text-center">
        <p className="text-eyebrow mb-4">Investor-Grade Feedback</p>
        <h1 className="font-display font-semibold text-[40px] leading-[1.1] tracking-[-0.01em] md:text-[56px]">
          Astronomic <span className="text-primary">Launchpad</span>
        </h1>
        <p className="font-serif mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-[1.6]">
          Get your business idea evaluated by an AI-powered panel of 14
          world-class investors and advisors. Receive a viability score, expert
          analysis, go-to-market strategy, and a 90-day action plan.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-24 pb-24">
        {state.status === "idle" || state.status === "error" ? (
          <>
            {state.status === "error" && (
              <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="max-w-2xl mx-auto">
              <IdeaForm onSubmit={handleSubmit} />
            </div>
          </>
        ) : state.status === "loading" ? (
          <LoadingState />
        ) : state.data ? (
          <div className="max-w-4xl mx-auto">
            <ResultsDashboard data={state.data} />
            <div className="mt-18 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setState({ status: "idle" })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Evaluate Another Idea
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Astronomic Launchpad &mdash; AI-powered business idea evaluation
      </footer>
    </main>
  );
}
