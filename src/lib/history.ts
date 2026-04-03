import type { SavedEvaluation, IdeaFormData, EvaluationResponse } from "./types";

const STORAGE_KEY = "astronomic-launchpad-history";
const MAX_EVALUATIONS = 20;

export function getHistory(): SavedEvaluation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEvaluation(
  formData: IdeaFormData,
  result: EvaluationResponse
): SavedEvaluation {
  const evaluation: SavedEvaluation = {
    id: crypto.randomUUID(),
    formData,
    result,
    createdAt: new Date().toISOString(),
  };

  const history = getHistory();
  history.unshift(evaluation);

  // Keep max entries
  if (history.length > MAX_EVALUATIONS) {
    history.length = MAX_EVALUATIONS;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return evaluation;
}

export function getEvaluation(id: string): SavedEvaluation | undefined {
  return getHistory().find((e) => e.id === id);
}

export function deleteEvaluation(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
