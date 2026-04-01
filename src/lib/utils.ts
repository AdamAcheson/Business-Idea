import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDecisionColor(decision: string): string {
  switch (decision) {
    case "BUILD":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "REVISE":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "ABANDON":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 7) return "text-emerald-600";
  if (score >= 4) return "text-amber-600";
  return "text-red-600";
}

export function getScoreBarColor(score: number): string {
  if (score >= 7) return "bg-emerald-500";
  if (score >= 4) return "bg-amber-500";
  return "bg-red-500";
}

export function getConfidenceColor(confidence: string): string {
  switch (confidence) {
    case "High":
      return "bg-emerald-100 text-emerald-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    case "Low":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case "Real Differentiation":
      return "bg-emerald-100 text-emerald-700";
    case "Partially Differentiated":
      return "bg-amber-100 text-amber-700";
    case "Mostly Marketing Fluff":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
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
