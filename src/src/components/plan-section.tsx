"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, Scale } from "lucide-react";
import type { Plan90Days } from "@/lib/types";

interface PlanSectionProps {
  plan90Days: Plan90Days;
}

const PHASES = [
  {
    key: "weeks1to2" as const,
    title: "Weeks 1-2",
    subtitle: "Launch Sprint",
    icon: Rocket,
    color: "text-[var(--red)]",
    bgColor: "bg-[var(--red-tint)]",
  },
  {
    key: "weeks3to6" as const,
    title: "Weeks 3-6",
    subtitle: "Validation Phase",
    icon: TrendingUp,
    color: "text-[var(--caution)]",
    bgColor: "bg-[var(--caution-tint)]",
  },
  {
    key: "weeks7to12" as const,
    title: "Weeks 7-12",
    subtitle: "Scale Phase",
    icon: Scale,
    color: "text-[var(--positive)]",
    bgColor: "bg-[var(--positive-tint)]",
  },
];

export function PlanSection({ plan90Days }: PlanSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-[22px] font-semibold text-foreground">90-Day Action Plan</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PHASES.map((phase) => {
          const data = plan90Days[phase.key];
          const Icon = phase.icon;

          return (
            <Card key={phase.key} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${phase.bgColor}`}>
                    <Icon className={`h-4 w-4 ${phase.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {phase.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {phase.subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Actions
                  </p>
                  <ul className="space-y-1">
                    {data.actions.map((action, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    KPIs
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.kpis.map((kpi, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {kpi}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Experiments
                  </p>
                  <ul className="space-y-1">
                    {data.experiments.map((exp, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--caution)] shrink-0" />
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Budget
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.budgetGuidance}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
