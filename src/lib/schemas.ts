import { z } from "zod";

export const formDataSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  offering: z.string().min(1, "Offering is required"),
  audience: z.string().min(1, "Target audience is required"),
  problem: z.string().min(1, "Problem is required"),
  secretSauce: z.string().min(1, "Secret sauce is required"),
  industry: z.string().optional(),
  businessType: z.string().optional(),
  geography: z.string().optional(),
  budget: z.string().optional(),
  founderBackground: z.string().optional(),
});

const ideaSummarySchema = z.object({
  companyName: z.string(),
  offering: z.string(),
  audience: z.string(),
  problem: z.string(),
  secretSauce: z.string(),
  marketCategory: z.string(),
  coreAssumptions: z.array(z.string()),
});

const weightedExpertSchema = z.object({
  name: z.string(),
  weight: z.number(),
  why: z.string(),
});

const businessTypeClassificationSchema = z.object({
  primaryType: z.string(),
  reasoning: z.string(),
  weightedExperts: z.array(weightedExpertSchema),
});

const expertAnalysisSchema = z.object({
  expert: z.string(),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  assumptionsChallenged: z.array(z.string()),
  improvements: z.array(z.string()),
  weightedImportance: z.number(),
});

const competitiveRealityCheckSchema = z.object({
  incumbents: z.array(z.string()),
  startups: z.array(z.string()),
  substitutes: z.array(z.string()),
  analysis: z.string(),
});

const secretSauceVerdictSchema = z.object({
  verdict: z.enum([
    "Real Differentiation",
    "Partially Differentiated",
    "Mostly Marketing Fluff",
  ]),
  defensibility: z.enum(["Low", "Medium", "High"]),
  explanation: z.string(),
});

const viabilitySubscoresSchema = z.object({
  problemSeverity: z.number().min(1).max(10),
  marketSize: z.number().min(1).max(10),
  differentiation: z.number().min(1).max(10),
  defensibility: z.number().min(1).max(10),
  monetization: z.number().min(1).max(10),
  speedToTraction: z.number().min(1).max(10),
});

const viabilityScoreSchema = z.object({
  score: z.number().min(1).max(10),
  confidence: z.enum(["Low", "Medium", "High"]),
  justification: z.string(),
  subscores: viabilitySubscoresSchema,
});

const decisionSchema = z.object({
  recommendation: z.enum(["BUILD", "REVISE", "ABANDON"]),
  reason: z.string(),
});

const gtmStrategySchema = z.object({
  icp: z.string(),
  positioning: z.string(),
  messagingPillars: z.array(z.string()),
  pricingModel: z.string(),
  channels: z.array(z.string()),
  competitiveWedge: z.string(),
});

const planPhaseSchema = z.object({
  actions: z.array(z.string()),
  kpis: z.array(z.string()),
  experiments: z.array(z.string()),
  budgetGuidance: z.string(),
});

const plan90DaysSchema = z.object({
  weeks1to2: planPhaseSchema,
  weeks3to6: planPhaseSchema,
  weeks7to12: planPhaseSchema,
});

export const evaluationResponseSchema = z.object({
  ideaSummary: ideaSummarySchema,
  businessTypeClassification: businessTypeClassificationSchema,
  expertAnalyses: z.array(expertAnalysisSchema),
  competitiveRealityCheck: competitiveRealityCheckSchema,
  secretSauceVerdict: secretSauceVerdictSchema,
  viabilityScore: viabilityScoreSchema,
  decision: decisionSchema,
  gtmStrategy: gtmStrategySchema,
  plan90Days: plan90DaysSchema,
});
