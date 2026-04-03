"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { ViabilityScore, Decision } from "@/lib/types";
import { cn, getDecisionColor, getScoreColor, getConfidenceColor } from "@/lib/utils";

interface ScoreCardProps {
  viabilityScore: ViabilityScore;
  decision: Decision;
}

const SUBSCORE_LABELS: Record<string, string> = {
  problemSeverity: "Problem",
  marketSize: "Market",
  differentiation: "Differentiation",
  defensibility: "Defensibility",
  monetization: "Monetization",
  speedToTraction: "Speed",
};

export function ScoreCard({ viabilityScore, decision }: ScoreCardProps) {
  const radarData = Object.entries(viabilityScore.subscores).map(
    ([key, value]) => ({
      subject: SUBSCORE_LABELS[key] || key,
      score: value,
      fullMark: 10,
    })
  );

  return (
    <Card className="border-0 shadow-lg">
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
              className={cn(
                "text-sm px-3 py-1",
                getConfidenceColor(viabilityScore.confidence)
              )}
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
              <p className="text-sm text-muted-foreground">
                {decision.reason}
              </p>
            </div>

            <p className="text-sm leading-relaxed">
              {viabilityScore.justification}
            </p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-md h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(122, 210, 231, 0.2)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#8b8fad", fontSize: 12 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#7AD2E7"
                  fill="#7AD2E7"
                  fillOpacity={0.3}
                  animationDuration={1200}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscore legend below chart */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          {Object.entries(viabilityScore.subscores).map(([key, value]) => (
            <div key={key} className="space-y-0.5">
              <span className="text-xs text-muted-foreground">
                {SUBSCORE_LABELS[key] || key}
              </span>
              <div
                className={cn(
                  "text-lg font-bold tabular-nums",
                  getScoreColor(value)
                )}
              >
                {value}
                <span className="text-xs text-muted-foreground font-normal">
                  /10
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
