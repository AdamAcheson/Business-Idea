"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ViabilityScore, Decision } from "@/lib/types";
import { cn, getDecisionColor, getScoreColor, getScoreBarColor, getConfidenceColor } from "@/lib/utils";

interface ScoreCardProps {
  viabilityScore: ViabilityScore;
  decision: Decision;
}

const SUBSCORE_LABELS: Record<string, string> = {
  problemSeverity: "Problem Severity",
  marketSize: "Market Size",
  differentiation: "Differentiation",
  defensibility: "Defensibility",
  monetization: "Monetization",
  speedToTraction: "Speed to Traction",
};

export function ScoreCard({ viabilityScore, decision }: ScoreCardProps) {
  return (
    <Card className="border">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Main Score */}
          <div className="flex flex-col items-center space-y-3 min-w-[140px]">
            <div
              className={cn(
                "text-6xl font-bold tabular-nums",
                getScoreColor(viabilityScore.score)
              )}
            >
              {viabilityScore.score}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              out of 10
            </p>
            <Badge
              variant="outline"
              className={cn("text-sm px-3 py-1", getConfidenceColor(viabilityScore.confidence))}
            >
              {viabilityScore.confidence} Confidence
            </Badge>
          </div>

          {/* Decision Badge + Justification */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col items-center md:items-start gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "text-xl font-bold px-6 py-2 border-2",
                  getDecisionColor(decision.recommendation)
                )}
              >
                {decision.recommendation}
              </Badge>
              <p className="text-sm text-muted-foreground">{decision.reason}</p>
            </div>

            <p className="text-sm leading-relaxed">
              {viabilityScore.justification}
            </p>
          </div>
        </div>

        {/* Subscores */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {Object.entries(viabilityScore.subscores).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {SUBSCORE_LABELS[key] || key}
                </span>
                <span className={cn("font-semibold tabular-nums", getScoreColor(value))}>
                  {value}/10
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", getScoreBarColor(value))}
                  style={{ width: `${value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
