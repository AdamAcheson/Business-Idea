export interface IdeaFormData {
  companyName: string;
  offering: string;
  audience: string;
  problem: string;
  secretSauce: string;
  industry?: string;
  businessType?: string;
  geography?: string;
  budget?: string;
  founderBackground?: string;
}

export interface IdeaSummary {
  companyName: string;
  offering: string;
  audience: string;
  problem: string;
  secretSauce: string;
  marketCategory: string;
  coreAssumptions: string[];
}

export interface WeightedExpert {
  name: string;
  weight: number;
  why: string;
}

export interface BusinessTypeClassification {
  primaryType: string;
  reasoning: string;
  weightedExperts: WeightedExpert[];
}

export interface ExpertAnalysis {
  expert: string;
  strengths: string[];
  risks: string[];
  assumptionsChallenged: string[];
  improvements: string[];
  weightedImportance: number;
}

export interface CompetitiveRealityCheck {
  incumbents: string[];
  startups: string[];
  substitutes: string[];
  analysis: string;
}

export interface SecretSauceVerdictSection {
  verdict: "Real Differentiation" | "Partially Differentiated" | "Mostly Marketing Fluff";
  defensibility: "Low" | "Medium" | "High";
  explanation: string;
}

export interface ViabilitySubscores {
  problemSeverity: number;
  marketSize: number;
  differentiation: number;
  defensibility: number;
  monetization: number;
  speedToTraction: number;
}

export interface ViabilityScore {
  score: number;
  confidence: "Low" | "Medium" | "High";
  justification: string;
  subscores: ViabilitySubscores;
}

export interface Decision {
  recommendation: "BUILD" | "REVISE" | "ABANDON";
  reason: string;
}

export interface GtmStrategy {
  icp: string;
  positioning: string;
  messagingPillars: string[];
  pricingModel: string;
  channels: string[];
  competitiveWedge: string;
}

export interface PlanPhase {
  actions: string[];
  kpis: string[];
  experiments: string[];
  budgetGuidance: string;
}

export interface Plan90Days {
  weeks1to2: PlanPhase;
  weeks3to6: PlanPhase;
  weeks7to12: PlanPhase;
}

export interface EvaluationResponse {
  ideaSummary: IdeaSummary;
  businessTypeClassification: BusinessTypeClassification;
  expertAnalyses: ExpertAnalysis[];
  competitiveRealityCheck: CompetitiveRealityCheck;
  secretSauceVerdict: SecretSauceVerdictSection;
  viabilityScore: ViabilityScore;
  decision: Decision;
  gtmStrategy: GtmStrategy;
  plan90Days: Plan90Days;
}

export interface SavedEvaluation {
  id: string;
  formData: IdeaFormData;
  result: EvaluationResponse;
  createdAt: string;
}

export type EvaluationStatus = "idle" | "loading" | "success" | "error";

export interface EvaluationState {
  status: EvaluationStatus;
  data?: EvaluationResponse;
  error?: string;
}
