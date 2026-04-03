"use client";

import { useState, useEffect, useRef } from "react";
import { IdeaForm } from "@/components/idea-form";
import { ResultsDashboard } from "@/components/results-dashboard";
import { LoadingState } from "@/components/loading-state";
import { HistoryPanel } from "@/components/history-panel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { saveEvaluation } from "@/lib/history";
import type {
  IdeaFormData,
  EvaluationResponse,
  EvaluationState,
  SavedEvaluation,
} from "@/lib/types";

export default function HomePage() {
  const [state, setState] = useState<EvaluationState>({ status: "idle" });
  const [currentFormData, setCurrentFormData] = useState<IdeaFormData | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => {
    if (state.status === "success") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  const [streamProgress, setStreamProgress] = useState(0);

  const handleSubmit = async (formData: IdeaFormData) => {
    setState({ status: "loading" });
    setCurrentFormData(formData);
    setStreamProgress(0);
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

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = JSON.parse(line.slice(6));

          if (json.type === "progress") {
            setStreamProgress(json.tokens);
          } else if (json.type === "done") {
            const data: EvaluationResponse = json.data;
            saveEvaluation(formData, data);
            setHistoryKey((k) => k + 1);
            setState({ status: "success", data });
          } else if (json.type === "error") {
            throw new Error(json.error);
          }
        }
      }
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

  const handleHistorySelect = (evaluation: SavedEvaluation) => {
    setCurrentFormData(evaluation.formData);
    setState({ status: "success", data: evaluation.result });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-16 pb-8 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Astronomic{" "}
          <span className="text-accent">Launchpad</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Get your business idea evaluated by an AI-powered panel of 14
          world-class investors and advisors. Receive a viability score, expert
          analysis, go-to-market strategy, and a 90-day action plan.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        {state.status === "idle" || state.status === "error" ? (
          <>
            <HistoryPanel key={historyKey} onSelect={handleHistorySelect} />
            {state.status === "error" && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <IdeaForm onSubmit={handleSubmit} />
          </>
        ) : state.status === "loading" ? (
          <LoadingState streamProgress={streamProgress} />
        ) : state.data ? (
          <>
            <ResultsDashboard data={state.data} formData={currentFormData} />
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setState({ status: "idle" })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Evaluate Another Idea
              </Button>
            </div>
          </>
        ) : null}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Astronomic Launchpad &mdash; AI-powered business idea evaluation
      </footer>
    </main>
  );
}
