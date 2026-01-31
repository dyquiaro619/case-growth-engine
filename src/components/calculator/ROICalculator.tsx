import { useState, useMemo } from "react";
import { InputSlider } from "./InputSlider";
import { ComparisonCard } from "./ComparisonCard";
import { MetricCard } from "./MetricCard";
import { LeadCaptureModal } from "./LeadCaptureModal";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Zap,
  ArrowRight,
  Info,
  Scale,
  Download,
} from "lucide-react";
import { generatePDFReport } from "./generatePDFReport";

export function ROICalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [conversionRate, setConversionRate] = useState(10);
  const [avgSettlement, setAvgSettlement] = useState(25000);
  const [adminHours, setAdminHours] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Automation assumptions
  const CONVERSION_LIFT = 0.20; // 20% improvement
  const TIME_REDUCTION = 0.70; // 70% reduction
  const CONTINGENCY_FEE = 0.33; // 33% standard fee
  const MONTHLY_INVESTMENT = 1500;

  const calculations = useMemo(() => {
    // Current state
    const currentCases = monthlyLeads * (conversionRate / 100);
    const currentMonthlyRevenue = currentCases * avgSettlement * CONTINGENCY_FEE;
    const currentAnnualRevenue = currentMonthlyRevenue * 12;
    const currentMonthlyAdminHours = currentCases * adminHours;

    // Projected state (with automation)
    const projectedConversionRate = conversionRate * (1 + CONVERSION_LIFT);
    const projectedCases = monthlyLeads * (projectedConversionRate / 100);
    const projectedMonthlyRevenue = projectedCases * avgSettlement * CONTINGENCY_FEE;
    const projectedAnnualRevenue = projectedMonthlyRevenue * 12;
    const projectedAdminHours = adminHours * (1 - TIME_REDUCTION);
    const projectedMonthlyAdminHours = projectedCases * projectedAdminHours;

    // Key metrics
    const additionalAnnualRevenue = projectedAnnualRevenue - currentAnnualRevenue;
    const hoursSavedMonthly = currentMonthlyAdminHours - projectedMonthlyAdminHours;
    const annualInvestment = MONTHLY_INVESTMENT * 12;
    const roiMultiple = additionalAnnualRevenue / annualInvestment;

    return {
      current: {
        cases: currentCases,
        monthlyRevenue: currentMonthlyRevenue,
        annualRevenue: currentAnnualRevenue,
        adminHours: currentMonthlyAdminHours,
        conversionRate: conversionRate,
      },
      projected: {
        cases: projectedCases,
        monthlyRevenue: projectedMonthlyRevenue,
        annualRevenue: projectedAnnualRevenue,
        adminHours: projectedMonthlyAdminHours,
        conversionRate: projectedConversionRate,
      },
      impact: {
        additionalRevenue: additionalAnnualRevenue,
        hoursSaved: hoursSavedMonthly,
        roiMultiple: roiMultiple,
        casesAdded: projectedCases - currentCases,
      },
    };
  }, [monthlyLeads, conversionRate, avgSettlement, adminHours]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  const formatNumber = (value: number) => Math.round(value).toLocaleString();
  const formatHours = (value: number) => `${Math.round(value)} hrs`;

  const handleExportPDF = () => {
    generatePDFReport({
      inputs: {
        monthlyLeads,
        conversionRate,
        avgSettlement,
        adminHours,
      },
      current: calculations.current,
      projected: calculations.projected,
      impact: calculations.impact,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground font-sans">
                  PI Firm Growth Calculator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Automation ROI Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <div className="group relative hidden md:block">
                <button className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                  <Info className="h-4 w-4" />
                  PI Firm Benchmark
                </button>
                <div className="invisible absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <p className="font-medium text-foreground mb-1">Industry Insight</p>
                  <p className="text-muted-foreground">
                    Firms with automated intake respond <span className="font-semibold text-success">98% faster</span> than manual competitors, dramatically increasing lead-to-client conversion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Stop the Intake Leak: Calculate How Much Revenue You're Losing to Faster Competitors Every Month
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Boutique PI firms are using this tool to identify an average of $190k+ in missed revenue. Adjust the sliders to find yours.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <div className="card-elevated p-6 md:p-8 sticky top-8">
              <h3 className="heading-display text-xl font-semibold text-foreground mb-6">
                Your Firm's Metrics
              </h3>
              <div className="space-y-8">
                <InputSlider
                  label="Monthly Leads"
                  value={monthlyLeads}
                  min={10}
                  max={1000}
                  step={10}
                  formatValue={(v) => formatNumber(v)}
                  onChange={setMonthlyLeads}
                  tooltip="Total number of potential client inquiries your firm receives each month"
                />
                <InputSlider
                  label="Current Conversion Rate"
                  value={conversionRate}
                  min={1}
                  max={30}
                  step={0.5}
                  formatValue={(v) => formatPercent(v)}
                  onChange={setConversionRate}
                  tooltip="Percentage of leads that become signed clients"
                />
                <InputSlider
                  label="Average Settlement Value"
                  value={avgSettlement}
                  min={5000}
                  max={100000}
                  step={1000}
                  formatValue={(v) => formatCurrency(v)}
                  onChange={setAvgSettlement}
                />
                <InputSlider
                  label="Admin Hours per Case Intake"
                  value={adminHours}
                  min={1}
                  max={20}
                  step={1}
                  formatValue={(v) => `${v} hours`}
                  onChange={setAdminHours}
                  tooltip="Hours spent on intake paperwork, diligence, and administrative tasks per case"
                />
              </div>

              {/* Assumptions Note */}
              <div className="mt-8 rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Automation Assumptions:</span>{" "}
                  20% conversion lift through faster response times • 70% reduction in admin hours • $1,500/mo platform investment
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                title="Additional Annual Revenue"
                value={calculations.impact.additionalRevenue}
                formatter={formatCurrency}
                subtitle="From improved conversion"
                icon={DollarSign}
                variant="success"
              />
              <MetricCard
                title="Hours Reclaimed"
                value={calculations.impact.hoursSaved}
                formatter={formatHours}
                subtitle="Saved monthly on admin"
                icon={Clock}
                variant="primary"
              />
              <MetricCard
                title="ROI Multiple"
                value={calculations.impact.roiMultiple}
                formatter={(v) => `${v.toFixed(1)}x`}
                subtitle="Return on investment"
                icon={TrendingUp}
                variant="accent"
                decimals={1}
              />
            </div>

            {/* Comparison Cards */}
            <div className="space-y-4">
              <h3 className="heading-display text-xl font-semibold text-foreground">
                Current vs. Projected Performance
              </h3>
              
              <ComparisonCard
                title="Monthly Signed Cases"
                currentValue={calculations.current.cases}
                projectedValue={calculations.projected.cases}
                formatter={(v) => v.toFixed(1)}
                improvement={`+${calculations.impact.casesAdded.toFixed(1)} cases/mo`}
                decimals={1}
              />
              
              <ComparisonCard
                title="Annual Revenue (33% Contingency)"
                currentValue={calculations.current.annualRevenue}
                projectedValue={calculations.projected.annualRevenue}
                formatter={formatCurrency}
                improvement={`+${formatCurrency(calculations.impact.additionalRevenue)}`}
              />
              
              <ComparisonCard
                title="Conversion Rate"
                currentValue={calculations.current.conversionRate}
                projectedValue={calculations.projected.conversionRate}
                formatter={formatPercent}
                improvement="+20% lift"
                decimals={1}
              />
              
              <ComparisonCard
                title="Monthly Admin Hours"
                currentValue={calculations.current.adminHours}
                projectedValue={calculations.projected.adminHours}
                formatter={formatHours}
                improvement="70% reduction"
              />
            </div>

            {/* CTA Section */}
            <div className="card-elevated p-6 md:p-8 bg-primary text-primary-foreground border-primary">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="heading-display text-2xl font-bold mb-2">
                    Ready to Transform Your Firm?
                  </h3>
                  <p className="text-primary-foreground/80">
                    Get a personalized automation roadmap tailored to your practice areas.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-6 py-4 text-base font-semibold text-primary transition-all hover:bg-primary-foreground/90 hover:shadow-lg whitespace-nowrap"
                >
                  <Zap className="h-5 w-5" />
                  Generate My Custom Roadmap
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            *Projections are estimates based on industry benchmarks. Actual results may vary based on practice area and market conditions.
          </p>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metrics={{
          additionalRevenue: calculations.impact.additionalRevenue,
          hoursSaved: calculations.impact.hoursSaved,
          roiMultiple: calculations.impact.roiMultiple,
        }}
      />
    </div>
  );
}
