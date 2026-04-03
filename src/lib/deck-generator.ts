import PptxGenJS from "pptxgenjs";
import type { EvaluationResponse, IdeaFormData } from "./types";

const NAVY = "030620";
const CYAN = "7AD2E7";
const ORANGE = "E24E29";
const WHITE = "FFFFFF";
const GRAY = "8b8fad";

function addTitle(slide: PptxGenJS.Slide, text: string) {
  slide.addText(text, {
    x: 0.6,
    y: 0.4,
    w: 8.8,
    h: 0.6,
    fontSize: 24,
    fontFace: "Helvetica",
    color: CYAN,
    bold: true,
  });
}

function addBullets(
  slide: PptxGenJS.Slide,
  items: string[],
  opts?: { y?: number; color?: string }
) {
  slide.addText(
    items.map((t) => ({
      text: t,
      options: { bullet: true, breakLine: true },
    })),
    {
      x: 0.6,
      y: opts?.y ?? 1.2,
      w: 8.8,
      h: 4,
      fontSize: 14,
      fontFace: "Helvetica",
      color: opts?.color ?? WHITE,
      lineSpacingMultiple: 1.5,
      valign: "top",
    }
  );
}

export function generatePitchDeck(
  data: EvaluationResponse,
  formData: IdeaFormData | null
): void {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";

  const defaultBg = { color: NAVY } as const;

  // Slide 1: Title
  const s1 = pptx.addSlide();
  s1.background = defaultBg;
  s1.addText(data.ideaSummary.companyName, {
    x: 0.6,
    y: 1.5,
    w: 8.8,
    h: 1.2,
    fontSize: 44,
    fontFace: "Helvetica",
    color: WHITE,
    bold: true,
  });
  s1.addText(data.ideaSummary.offering, {
    x: 0.6,
    y: 2.8,
    w: 8.8,
    h: 1,
    fontSize: 18,
    fontFace: "Helvetica",
    color: GRAY,
  });
  s1.addText("Astronomic Launchpad", {
    x: 0.6,
    y: 6.2,
    w: 4,
    h: 0.4,
    fontSize: 12,
    fontFace: "Helvetica",
    color: ORANGE,
  });

  // Slide 2: Problem
  const s2 = pptx.addSlide();
  s2.background = defaultBg;
  addTitle(s2, "The Problem");
  s2.addText(data.ideaSummary.problem, {
    x: 0.6,
    y: 1.2,
    w: 8.8,
    h: 1.5,
    fontSize: 20,
    fontFace: "Helvetica",
    color: WHITE,
    lineSpacingMultiple: 1.4,
  });
  s2.addText(`Market Category: ${data.ideaSummary.marketCategory}`, {
    x: 0.6,
    y: 3.2,
    w: 8.8,
    h: 0.5,
    fontSize: 14,
    fontFace: "Helvetica",
    color: CYAN,
  });
  addBullets(s2, data.ideaSummary.coreAssumptions, { y: 4 });

  // Slide 3: Solution
  const s3 = pptx.addSlide();
  s3.background = defaultBg;
  addTitle(s3, "Our Solution");
  s3.addText(data.ideaSummary.offering, {
    x: 0.6,
    y: 1.2,
    w: 8.8,
    h: 1.2,
    fontSize: 20,
    fontFace: "Helvetica",
    color: WHITE,
    lineSpacingMultiple: 1.4,
  });
  s3.addText("Secret Sauce", {
    x: 0.6,
    y: 2.8,
    w: 8.8,
    h: 0.5,
    fontSize: 16,
    fontFace: "Helvetica",
    color: ORANGE,
    bold: true,
  });
  s3.addText(data.ideaSummary.secretSauce, {
    x: 0.6,
    y: 3.4,
    w: 8.8,
    h: 1.5,
    fontSize: 14,
    fontFace: "Helvetica",
    color: WHITE,
    lineSpacingMultiple: 1.4,
  });

  // Slide 4: Market
  const s4 = pptx.addSlide();
  s4.background = defaultBg;
  addTitle(s4, "Market Opportunity");
  s4.addText(`Target Audience: ${data.ideaSummary.audience}`, {
    x: 0.6,
    y: 1.2,
    w: 8.8,
    h: 0.8,
    fontSize: 16,
    fontFace: "Helvetica",
    color: WHITE,
  });
  s4.addText(
    `Market Size Score: ${data.viabilityScore.subscores.marketSize}/10`,
    {
      x: 0.6,
      y: 2.2,
      w: 4,
      h: 0.5,
      fontSize: 14,
      fontFace: "Helvetica",
      color: CYAN,
    }
  );
  s4.addText(data.competitiveRealityCheck.analysis, {
    x: 0.6,
    y: 3,
    w: 8.8,
    h: 3,
    fontSize: 13,
    fontFace: "Helvetica",
    color: GRAY,
    lineSpacingMultiple: 1.4,
  });

  // Slide 5: Competition
  const s5 = pptx.addSlide();
  s5.background = defaultBg;
  addTitle(s5, "Competitive Landscape");
  const compRows: PptxGenJS.TableRow[] = [
    [
      { text: "Incumbents", options: { bold: true, color: CYAN, fontSize: 12 } },
      { text: "Startups", options: { bold: true, color: CYAN, fontSize: 12 } },
      { text: "Substitutes", options: { bold: true, color: CYAN, fontSize: 12 } },
    ],
    [
      { text: data.competitiveRealityCheck.incumbents.join("\n"), options: { fontSize: 11, color: WHITE } },
      { text: data.competitiveRealityCheck.startups.join("\n"), options: { fontSize: 11, color: WHITE } },
      { text: data.competitiveRealityCheck.substitutes.join("\n"), options: { fontSize: 11, color: WHITE } },
    ],
  ];
  s5.addTable(compRows, {
    x: 0.6,
    y: 1.2,
    w: 8.8,
    border: { type: "solid", pt: 0.5, color: CYAN },
    colW: [2.93, 2.93, 2.93],
    rowH: [0.4, 1.5],
  });

  // Slide 6: Differentiation
  const s6 = pptx.addSlide();
  s6.background = defaultBg;
  addTitle(s6, "Differentiation & Defensibility");
  s6.addText(
    `Verdict: ${data.secretSauceVerdict.verdict}  |  Defensibility: ${data.secretSauceVerdict.defensibility}`,
    {
      x: 0.6,
      y: 1.2,
      w: 8.8,
      h: 0.5,
      fontSize: 16,
      fontFace: "Helvetica",
      color: ORANGE,
      bold: true,
    }
  );
  s6.addText(data.secretSauceVerdict.explanation, {
    x: 0.6,
    y: 2,
    w: 8.8,
    h: 2.5,
    fontSize: 14,
    fontFace: "Helvetica",
    color: WHITE,
    lineSpacingMultiple: 1.5,
  });

  // Slide 7: Business Model
  const s7 = pptx.addSlide();
  s7.background = defaultBg;
  addTitle(s7, "Business Model");
  addBullets(s7, [
    `Pricing: ${data.gtmStrategy.pricingModel}`,
    `Monetization Score: ${data.viabilityScore.subscores.monetization}/10`,
    `Channels: ${data.gtmStrategy.channels.join(", ")}`,
    `Competitive Wedge: ${data.gtmStrategy.competitiveWedge}`,
  ]);

  // Slide 8: GTM Strategy
  const s8 = pptx.addSlide();
  s8.background = defaultBg;
  addTitle(s8, "Go-To-Market Strategy");
  addBullets(s8, [
    `ICP: ${data.gtmStrategy.icp}`,
    `Positioning: ${data.gtmStrategy.positioning}`,
    ...data.gtmStrategy.messagingPillars.map((p) => `Message: ${p}`),
  ]);

  // Slide 9: 90-Day Plan
  const s9 = pptx.addSlide();
  s9.background = defaultBg;
  addTitle(s9, "90-Day Action Plan");
  const phases = [
    { label: "Weeks 1-2", d: data.plan90Days.weeks1to2 },
    { label: "Weeks 3-6", d: data.plan90Days.weeks3to6 },
    { label: "Weeks 7-12", d: data.plan90Days.weeks7to12 },
  ];
  phases.forEach((p, i) => {
    const xOff = 0.4 + i * 3.2;
    s9.addText(p.label, {
      x: xOff,
      y: 1.2,
      w: 3,
      h: 0.4,
      fontSize: 14,
      fontFace: "Helvetica",
      color: ORANGE,
      bold: true,
    });
    s9.addText(p.d.actions.map((a) => `• ${a}`).join("\n"), {
      x: xOff,
      y: 1.7,
      w: 3,
      h: 4,
      fontSize: 10,
      fontFace: "Helvetica",
      color: WHITE,
      lineSpacingMultiple: 1.3,
      valign: "top",
    });
  });

  // Slide 10: Ask
  const s10 = pptx.addSlide();
  s10.background = defaultBg;
  s10.addText(data.ideaSummary.companyName, {
    x: 0.6,
    y: 1,
    w: 8.8,
    h: 1,
    fontSize: 36,
    fontFace: "Helvetica",
    color: WHITE,
    bold: true,
    align: "center",
  });

  const scoreColor =
    data.viabilityScore.score >= 7
      ? "10b981"
      : data.viabilityScore.score >= 4
        ? "f59e0b"
        : "ef4444";
  s10.addText(`${data.viabilityScore.score}/10`, {
    x: 3,
    y: 2.2,
    w: 4,
    h: 1,
    fontSize: 48,
    fontFace: "Helvetica",
    color: scoreColor,
    bold: true,
    align: "center",
  });
  s10.addText(data.decision.recommendation, {
    x: 3,
    y: 3.3,
    w: 4,
    h: 0.7,
    fontSize: 28,
    fontFace: "Helvetica",
    color: scoreColor,
    bold: true,
    align: "center",
  });
  s10.addText("Generated by Astronomic Launchpad", {
    x: 0.6,
    y: 6.2,
    w: 8.8,
    h: 0.4,
    fontSize: 11,
    fontFace: "Helvetica",
    color: GRAY,
    align: "center",
  });

  pptx.writeFile({
    fileName: `${data.ideaSummary.companyName.replace(/\s+/g, "-")}-pitch-deck`,
  });
}
