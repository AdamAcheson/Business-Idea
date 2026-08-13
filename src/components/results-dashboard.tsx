"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScoreCard } from "./score-card";
import { ExpertPanel } from "./expert-panel";
import { GtmSection } from "./gtm-section";
import { PlanSection } from "./plan-section";
import { Shield, Users, Boxes } from "lucide-react";
import { cn, getVerdictColor } from "@/lib/utils";
import type { EvaluationResponse } from "@/lib/types";

interface ResultsDashboardProps {
  data: EvaluationResponse;
}

export function ResultsDashboard({ data }: ResultsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Idea Summary */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-[28px] font-semibold">
          {data.ideaSummary.companyName}
        </h2>
        <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto leading-[1.6]">
          {data.ideaSummary.offering} &mdash; helping{" "}
          {data.ideaSummary.audience} {data.ideaSummary.problem} with{" "}
          {data.ideaSummary.secretSauce}
        </p>
        <Badge variant="secondary">{data.ideaSummary.marketCategory}</Badge>
      </div>

      {/* Core Assumptions */}
      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Core Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.ideaSummary.coreAssumptions.map((assumption, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">
                {assumption}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Card */}
      <ScoreCard
        viabilityScore={data.viabilityScore}
        decision={data.decision}
      />

      <Separator />

      {/* Expert Panel */}
      <ExpertPanel
        expertAnalyses={data.expertAnalyses}
        classification={data.businessTypeClassification}
      />

      <Separator />

      {/* Competitive Reality Check */}
      <div className="space-y-4">
        <h3 className="font-display text-[22px] font-semibold text-foreground">Competitive Reality Check</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Boxes className="h-4 w-4 text-primary" />
                Incumbents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {data.competitiveRealityCheck.incumbents.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    &bull; {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Startups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {data.competitiveRealityCheck.startups.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    &bull; {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Substitutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {data.competitiveRealityCheck.substitutes.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    &bull; {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.competitiveRealityCheck.analysis}
        </p>
      </div>

      <Separator />

      {/* Secret Sauce Verdict */}
      <div className="space-y-4">
        <h3 className="font-display text-[22px] font-semibold text-foreground">Secret Sauce Verdict</h3>
        <Card className="border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm px-3 py-1",
                    getVerdictColor(data.secretSauceVerdict.verdict)
                  )}
                >
                  {data.secretSauceVerdict.verdict}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  Defensibility: {data.secretSauceVerdict.defensibility}
                </Badge>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {data.secretSauceVerdict.explanation}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* GTM Strategy */}
      <GtmSection gtmStrategy={data.gtmStrategy} />

      <Separator />

      {/* 90-Day Plan */}
      <PlanSection plan90Days={data.plan90Days} />
    </div>
  );
}
