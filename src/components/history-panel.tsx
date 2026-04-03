"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Trash2, ChevronRight } from "lucide-react";
import { getHistory, deleteEvaluation } from "@/lib/history";
import { cn, getDecisionColor, getScoreColor } from "@/lib/utils";
import type { SavedEvaluation } from "@/lib/types";

interface HistoryPanelProps {
  onSelect: (evaluation: SavedEvaluation) => void;
}

export function HistoryPanel({ onSelect }: HistoryPanelProps) {
  const [history, setHistory] = useState<SavedEvaluation[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvaluation(id);
    setHistory(getHistory());
  };

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 text-muted-foreground"
      >
        <History className="mr-2 h-4 w-4" />
        Past Evaluations ({history.length})
        <ChevronRight
          className={cn(
            "ml-1 h-4 w-4 transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </Button>

      {isOpen && (
        <Card className="border border-border">
          <CardContent className="pt-4 space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/60 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={cn(
                      "text-xl font-bold tabular-nums w-8 text-center shrink-0",
                      getScoreColor(item.result.viabilityScore.score)
                    )}
                  >
                    {item.result.viabilityScore.score}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.result.ideaSummary.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      getDecisionColor(item.result.decision.recommendation)
                    )}
                  >
                    {item.result.decision.recommendation}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
