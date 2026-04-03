import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { EvaluationResponse } from "./types";

const NAVY = "#030620";
const CYAN = "#7AD2E7";
const ORANGE = "#E24E29";
const WHITE = "#FFFFFF";
const GRAY = "#8b8fad";

export function generateReport(data: EvaluationResponse): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  function addHeader(text: string) {
    doc.setFontSize(16);
    doc.setTextColor(CYAN);
    doc.setFont("helvetica", "bold");
    doc.text(text, margin, y);
    y += 8;
    doc.setDrawColor(CYAN);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;
  }

  function addBody(text: string) {
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  }

  function checkPage(needed: number) {
    if (y + needed > 270) {
      doc.addPage();
      y = 25;
    }
  }

  // --- Page 1: Title + Score ---
  doc.setFillColor(NAVY);
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setFontSize(28);
  doc.setTextColor(WHITE);
  doc.setFont("helvetica", "bold");
  doc.text("Astronomic", pageWidth / 2 - 30, 30);
  doc.setTextColor(ORANGE);
  doc.text("Launchpad", pageWidth / 2 + 25, 30);

  doc.setFontSize(12);
  doc.setTextColor(GRAY);
  doc.setFont("helvetica", "normal");
  doc.text("Business Idea Evaluation Report", pageWidth / 2, 42, {
    align: "center",
  });

  doc.setFontSize(22);
  doc.setTextColor(WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(data.ideaSummary.companyName, pageWidth / 2, 58, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, 68, {
    align: "center",
  });

  // Score section
  y = 95;
  doc.setFontSize(48);
  const scoreColor =
    data.viabilityScore.score >= 7
      ? "#10b981"
      : data.viabilityScore.score >= 4
        ? "#f59e0b"
        : "#ef4444";
  doc.setTextColor(scoreColor);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.viabilityScore.score}/10`, pageWidth / 2, y, {
    align: "center",
  });
  y += 12;

  doc.setFontSize(20);
  const decColor =
    data.decision.recommendation === "BUILD"
      ? "#10b981"
      : data.decision.recommendation === "REVISE"
        ? "#f59e0b"
        : "#ef4444";
  doc.setTextColor(decColor);
  doc.text(data.decision.recommendation, pageWidth / 2, y, {
    align: "center",
  });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  const reasonLines = doc.splitTextToSize(data.decision.reason, contentWidth);
  doc.text(reasonLines, margin, y);
  y += reasonLines.length * 5 + 8;

  // Subscores
  addHeader("Viability Subscores");
  const subscoreLabels: Record<string, string> = {
    problemSeverity: "Problem Severity",
    marketSize: "Market Size",
    differentiation: "Differentiation",
    defensibility: "Defensibility",
    monetization: "Monetization",
    speedToTraction: "Speed to Traction",
  };
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Dimension", "Score"]],
    body: Object.entries(data.viabilityScore.subscores).map(([key, val]) => [
      subscoreLabels[key] || key,
      `${val}/10`,
    ]),
    theme: "grid",
    headStyles: { fillColor: [3, 6, 32], textColor: [122, 210, 231] },
    styles: { fontSize: 10 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  addBody(data.viabilityScore.justification);

  // --- Page 2: Idea Summary ---
  doc.addPage();
  y = 25;
  addHeader("Idea Summary");
  addBody(`Offering: ${data.ideaSummary.offering}`);
  addBody(`Audience: ${data.ideaSummary.audience}`);
  addBody(`Problem: ${data.ideaSummary.problem}`);
  addBody(`Secret Sauce: ${data.ideaSummary.secretSauce}`);
  addBody(`Market Category: ${data.ideaSummary.marketCategory}`);

  checkPage(30);
  addHeader("Core Assumptions");
  data.ideaSummary.coreAssumptions.forEach((a, i) => {
    addBody(`${i + 1}. ${a}`);
  });

  checkPage(30);
  addHeader("Secret Sauce Verdict");
  addBody(
    `Verdict: ${data.secretSauceVerdict.verdict} | Defensibility: ${data.secretSauceVerdict.defensibility}`
  );
  addBody(data.secretSauceVerdict.explanation);

  // --- Page 3: Expert Panel ---
  doc.addPage();
  y = 25;
  addHeader("Expert Panel Analysis");

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Expert", "Weight", "Top Strength", "Top Risk"]],
    body: data.expertAnalyses.map((e) => [
      e.expert,
      `${e.weightedImportance}x`,
      e.strengths[0] || "",
      e.risks[0] || "",
    ]),
    theme: "grid",
    headStyles: { fillColor: [3, 6, 32], textColor: [122, 210, 231] },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 15 },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // --- Competitive Check ---
  checkPage(60);
  addHeader("Competitive Reality Check");
  addBody(`Incumbents: ${data.competitiveRealityCheck.incumbents.join(", ")}`);
  addBody(`Startups: ${data.competitiveRealityCheck.startups.join(", ")}`);
  addBody(
    `Substitutes: ${data.competitiveRealityCheck.substitutes.join(", ")}`
  );
  addBody(data.competitiveRealityCheck.analysis);

  // --- GTM ---
  doc.addPage();
  y = 25;
  addHeader("Go-To-Market Strategy");
  addBody(`ICP: ${data.gtmStrategy.icp}`);
  addBody(`Positioning: ${data.gtmStrategy.positioning}`);
  addBody(`Pricing: ${data.gtmStrategy.pricingModel}`);
  addBody(`Competitive Wedge: ${data.gtmStrategy.competitiveWedge}`);
  addBody(`Channels: ${data.gtmStrategy.channels.join(", ")}`);
  addBody(
    `Messaging Pillars: ${data.gtmStrategy.messagingPillars.join(" | ")}`
  );

  // --- 90-Day Plan ---
  checkPage(60);
  addHeader("90-Day Action Plan");

  const phases = [
    { label: "Weeks 1-2", data: data.plan90Days.weeks1to2 },
    { label: "Weeks 3-6", data: data.plan90Days.weeks3to6 },
    { label: "Weeks 7-12", data: data.plan90Days.weeks7to12 },
  ];

  phases.forEach((phase) => {
    checkPage(40);
    doc.setFontSize(12);
    doc.setTextColor(ORANGE);
    doc.setFont("helvetica", "bold");
    doc.text(phase.label, margin, y);
    y += 6;
    addBody(`Actions: ${phase.data.actions.join("; ")}`);
    addBody(`KPIs: ${phase.data.kpis.join("; ")}`);
    addBody(`Experiments: ${phase.data.experiments.join("; ")}`);
    addBody(`Budget: ${phase.data.budgetGuidance}`);
  });

  doc.save(
    `${data.ideaSummary.companyName.replace(/\s+/g, "-")}-evaluation.pdf`
  );
}
