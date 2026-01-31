import { jsPDF } from "jspdf";

interface ReportData {
  inputs: {
    monthlyLeads: number;
    conversionRate: number;
    avgSettlement: number;
    adminHours: number;
  };
  current: {
    cases: number;
    annualRevenue: number;
    adminHours: number;
    conversionRate: number;
  };
  projected: {
    cases: number;
    annualRevenue: number;
    adminHours: number;
    conversionRate: number;
  };
  impact: {
    additionalRevenue: number;
    hoursSaved: number;
    roiMultiple: number;
    casesAdded: number;
  };
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function generatePDFReport(data: ReportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Colors
  const navy = [26, 35, 126] as const;
  const slate = [100, 116, 139] as const;
  const success = [34, 197, 94] as const;
  const white = [255, 255, 255] as const;

  // Helper functions
  const addText = (
    text: string,
    x: number,
    y: number,
    options?: { fontSize?: number; color?: readonly [number, number, number]; fontStyle?: string }
  ) => {
    const { fontSize = 12, color = [0, 0, 0], fontStyle = "normal" } = options || {};
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", fontStyle);
    doc.text(text, x, y);
  };

  const drawRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: readonly [number, number, number]
  ) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(x, y, w, h, "F");
  };

  // Header
  drawRect(0, 0, pageWidth, 45, navy);
  addText("PI Firm Growth Calculator", margin, 22, {
    fontSize: 22,
    color: white,
    fontStyle: "bold",
  });
  addText("Automation ROI Analysis Report", margin, 32, {
    fontSize: 12,
    color: white,
  });
  addText(`Generated: ${new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  })}`, margin, 40, {
    fontSize: 10,
    color: white,
  });

  yPos = 60;

  // Executive Summary Box
  drawRect(margin, yPos, contentWidth, 35, [240, 253, 244]);
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, 35, "S");
  
  addText("EXECUTIVE SUMMARY", margin + 5, yPos + 10, {
    fontSize: 10,
    color: success,
    fontStyle: "bold",
  });
  addText(
    `With automation, your firm could generate an additional ${formatCurrency(data.impact.additionalRevenue)} annually`,
    margin + 5,
    yPos + 20,
    { fontSize: 11, color: navy, fontStyle: "bold" }
  );
  addText(
    `while reclaiming ${Math.round(data.impact.hoursSaved)} hours per month — a ${data.impact.roiMultiple.toFixed(1)}x return on investment.`,
    margin + 5,
    yPos + 28,
    { fontSize: 11, color: slate }
  );

  yPos += 50;

  // Your Firm's Inputs Section
  addText("YOUR FIRM'S METRICS", margin, yPos, {
    fontSize: 14,
    color: navy,
    fontStyle: "bold",
  });
  yPos += 8;
  doc.setDrawColor(navy[0], navy[1], navy[2]);
  doc.setLineWidth(1);
  doc.line(margin, yPos, margin + 50, yPos);
  yPos += 10;

  const inputItems = [
    ["Monthly Leads", data.inputs.monthlyLeads.toLocaleString()],
    ["Current Conversion Rate", `${data.inputs.conversionRate}%`],
    ["Average Settlement Value", formatCurrency(data.inputs.avgSettlement)],
    ["Admin Hours per Case", `${data.inputs.adminHours} hours`],
  ];

  inputItems.forEach(([label, value]) => {
    addText(label, margin, yPos, { fontSize: 10, color: slate });
    addText(value, margin + 80, yPos, { fontSize: 10, color: navy, fontStyle: "bold" });
    yPos += 7;
  });

  yPos += 10;

  // Comparison Table
  addText("CURRENT VS. PROJECTED PERFORMANCE", margin, yPos, {
    fontSize: 14,
    color: navy,
    fontStyle: "bold",
  });
  yPos += 8;
  doc.line(margin, yPos, margin + 80, yPos);
  yPos += 10;

  // Table Header
  drawRect(margin, yPos, contentWidth, 10, navy);
  addText("Metric", margin + 5, yPos + 7, { fontSize: 10, color: white, fontStyle: "bold" });
  addText("Current", margin + 75, yPos + 7, { fontSize: 10, color: white, fontStyle: "bold" });
  addText("Projected", margin + 115, yPos + 7, { fontSize: 10, color: white, fontStyle: "bold" });
  addText("Improvement", margin + 155, yPos + 7, { fontSize: 10, color: white, fontStyle: "bold" });
  yPos += 10;

  // Table Rows
  const tableData = [
    {
      metric: "Monthly Signed Cases",
      current: data.current.cases.toFixed(1),
      projected: data.projected.cases.toFixed(1),
      improvement: `+${data.impact.casesAdded.toFixed(1)} cases`,
    },
    {
      metric: "Annual Revenue",
      current: formatCurrency(data.current.annualRevenue),
      projected: formatCurrency(data.projected.annualRevenue),
      improvement: `+${formatCurrency(data.impact.additionalRevenue)}`,
    },
    {
      metric: "Conversion Rate",
      current: `${data.current.conversionRate.toFixed(1)}%`,
      projected: `${data.projected.conversionRate.toFixed(1)}%`,
      improvement: "+20% lift",
    },
    {
      metric: "Monthly Admin Hours",
      current: `${Math.round(data.current.adminHours)} hrs`,
      projected: `${Math.round(data.projected.adminHours)} hrs`,
      improvement: "70% reduction",
    },
  ];

  tableData.forEach((row, index) => {
    const rowY = yPos + index * 12;
    if (index % 2 === 0) {
      drawRect(margin, rowY, contentWidth, 12, [248, 250, 252]);
    }
    addText(row.metric, margin + 5, rowY + 8, { fontSize: 9, color: slate });
    addText(row.current, margin + 75, rowY + 8, { fontSize: 9, color: navy });
    addText(row.projected, margin + 115, rowY + 8, { fontSize: 9, color: success, fontStyle: "bold" });
    addText(row.improvement, margin + 155, rowY + 8, { fontSize: 9, color: success });
  });

  yPos += 60;

  // Key Metrics Highlight
  addText("KEY IMPACT METRICS", margin, yPos, {
    fontSize: 14,
    color: navy,
    fontStyle: "bold",
  });
  yPos += 8;
  doc.line(margin, yPos, margin + 50, yPos);
  yPos += 15;

  // Three metric boxes
  const boxWidth = (contentWidth - 10) / 3;
  
  // Box 1 - Additional Revenue
  drawRect(margin, yPos, boxWidth, 35, [240, 253, 244]);
  addText("Additional Annual Revenue", margin + 5, yPos + 10, { fontSize: 8, color: slate });
  addText(formatCurrency(data.impact.additionalRevenue), margin + 5, yPos + 25, {
    fontSize: 14,
    color: success,
    fontStyle: "bold",
  });

  // Box 2 - Hours Saved
  drawRect(margin + boxWidth + 5, yPos, boxWidth, 35, [239, 246, 255]);
  addText("Hours Reclaimed Monthly", margin + boxWidth + 10, yPos + 10, { fontSize: 8, color: slate });
  addText(`${Math.round(data.impact.hoursSaved)} hrs`, margin + boxWidth + 10, yPos + 25, {
    fontSize: 14,
    color: navy,
    fontStyle: "bold",
  });

  // Box 3 - ROI
  drawRect(margin + (boxWidth + 5) * 2, yPos, boxWidth, 35, [254, 249, 195]);
  addText("ROI Multiple", margin + (boxWidth + 5) * 2 + 5, yPos + 10, { fontSize: 8, color: slate });
  addText(`${data.impact.roiMultiple.toFixed(1)}x`, margin + (boxWidth + 5) * 2 + 5, yPos + 25, {
    fontSize: 14,
    color: [161, 98, 7],
    fontStyle: "bold",
  });

  yPos += 50;

  // Assumptions
  addText("CALCULATION ASSUMPTIONS", margin, yPos, {
    fontSize: 10,
    color: slate,
    fontStyle: "bold",
  });
  yPos += 8;

  const assumptions = [
    "• 20% conversion lift through faster response times",
    "• 70% reduction in administrative hours per case",
    "• 33% standard contingency fee on settlements",
    "• $1,500/month automation platform investment",
  ];

  assumptions.forEach((assumption) => {
    addText(assumption, margin, yPos, { fontSize: 9, color: slate });
    yPos += 6;
  });

  yPos += 10;

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  addText(
    "* Projections are estimates based on industry benchmarks. Actual results may vary.",
    margin,
    yPos,
    { fontSize: 8, color: slate }
  );

  // Save the PDF
  doc.save("PI-Firm-ROI-Analysis.pdf");
}
