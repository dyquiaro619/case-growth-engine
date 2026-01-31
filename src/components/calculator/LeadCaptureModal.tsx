import { useState } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: {
    additionalRevenue: number;
    hoursSaved: number;
    roiMultiple: number;
  };
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  metrics,
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firmName: "",
    phone: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-fade-in rounded-2xl bg-card p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <>
            <div className="mb-6 text-center">
              <h2 className="heading-display text-2xl font-bold text-foreground">
                Your Custom Automation Roadmap
              </h2>
              <p className="mt-2 text-muted-foreground">
                Based on your inputs, here's what automation could unlock for
                your firm:
              </p>
            </div>

            {/* Quick Stats */}
            <div className="mb-6 grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Added Revenue</p>
                <p className="text-lg font-bold text-success">
                  {formatCurrency(metrics.additionalRevenue)}
                </p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-xs text-muted-foreground">Hours Saved</p>
                <p className="text-lg font-bold text-primary">
                  {metrics.hoursSaved}/mo
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className="text-lg font-bold text-accent">
                  {metrics.roiMultiple.toFixed(1)}x
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Firm Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Smith & Associates"
                    value={formData.firmName}
                    onChange={(e) =>
                      setFormData({ ...formData, firmName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="john@smithlaw.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                Generate My Roadmap
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="heading-display text-2xl font-bold text-foreground">
              Your Roadmap Is on the Way!
            </h2>
            <p className="mt-3 text-muted-foreground">
              We'll send your personalized automation roadmap to your email
              within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg bg-muted px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
