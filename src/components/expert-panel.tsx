"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, HelpCircle, Lightbulb } from "lucide-react";
import type { ExpertAnalysis, BusinessTypeClassification } from "@/lib/types";

interface ExpertPanelProps {
  expertAnalyses: ExpertAnalysis[];
  classification: BusinessTypeClassification;
}

export function ExpertPanel({ expertAnalyses, classification }: ExpertPanelProps) {
  // Sort by weighted importance (highest first)
  const sorted = [...expertAnalyses].sort(
    (a, b) => b.weightedImportance - a.weightedImportance
  );

  // Top 3 by weight start expanded
  const defaultOpen = sorted.slice(0, 3).map((e) => e.expert);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[22px] font-semibold text-foreground">Expert Panel Analysis</h3>
        <Badge variant="secondary" className="text-xs">
          {classification.primaryType}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{classification.reasoning}</p>

      <Accordion multiple defaultValue={defaultOpen} className="space-y-3">
        {sorted.map((expert) => {
          const weightInfo = classification.weightedExperts.find(
            (w) => w.name === expert.expert
          );
          const weight = weightInfo?.weight ?? expert.weightedImportance;
          const isBoosted = weight > 1.0;

          return (
            <AccordionItem
              key={expert.expert}
              value={expert.expert}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">
                    {expert.expert}
                  </span>
                  {isBoosted && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-[var(--paper-shade)] text-[var(--ink-65)] border-[var(--line-strong)]"
                    >
                      {weight}x
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Section
                    icon={<CheckCircle2 className="h-4 w-4 text-[var(--positive)]" />}
                    title="Strengths"
                    items={expert.strengths}
                  />
                  <Section
                    icon={<AlertTriangle className="h-4 w-4 text-[var(--critical)]" />}
                    title="Risks"
                    items={expert.risks}
                  />
                  <Section
                    icon={<HelpCircle className="h-4 w-4 text-[var(--caution)]" />}
                    title="Assumptions Challenged"
                    items={expert.assumptionsChallenged}
                  />
                  <Section
                    icon={<Lightbulb className="h-4 w-4 text-[var(--ink-45)]" />}
                    title="Improvements"
                    items={expert.improvements}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function Section({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground pl-6">
            &bull; {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
