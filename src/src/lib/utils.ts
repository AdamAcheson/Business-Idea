import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDecisionColor(decision: string): string {
  switch (decision) {
    case "BUILD":
      return "bg-[var(--positive-tint)] text-[var(--positive)] border-[var(--positive)]/30";
    case "REVISE":
      return "bg-[var(--caution-tint)] text-[var(--caution)] border-[var(--caution)]/30";
    case "ABANDON":
      return "bg-[var(--critical-tint)] text-[var(--critical)] border-[var(--critical)]/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 7) return "text-[var(--positive)]";
  if (score >= 4) return "text-[var(--caution)]";
  return "text-[var(--critical)]";
}

export function getScoreBarColor(score: number): string {
  if (score >= 7) return "bg-[var(--positive)]";
  if (score >= 4) return "bg-[var(--caution)]";
  return "bg-[var(--critical)]";
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case "High":
      return "bg-[var(--positive-tint)] text-[var(--positive)]";
    case "Medium":
      return "bg-[var(--caution-tint)] text-[var(--caution)]";
    case "Low":
      return "bg-[var(--critical-tint)] text-[var(--critical)]";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case "Real Differentiation":
      return "bg-[var(--positive-tint)] text-[var(--positive)]";
    case "Partially Differentiated":
      return "bg-[var(--caution-tint)] text-[var(--caution)]";
    case "Mostly Marketing Fluff":
      return "bg-[var(--critical-tint)] text-[var(--critical)]";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export const LOADING_MESSAGES = [
  "Assembling expert panel...",
  "Analyzing your business model...",
  "Running competitive landscape scan...",
  "Evaluating market dynamics...",
  "Testing your secret sauce...",
  "Scoring viability metrics...",
  "Crafting go-to-market strategy...",
  "Building your 90-day plan...",
  "Finalizing recommendations...",
];
