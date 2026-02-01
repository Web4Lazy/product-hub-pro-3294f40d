import { AlertTriangle, X } from "lucide-react";
import { Alert } from "@/types/product";

interface AlertBannerProps {
  alerts: Alert[];
  onDismiss: (index: number) => void;
}

export const AlertBanner = ({ alerts, onDismiss }: AlertBannerProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 bg-warning-background border border-warning-border rounded-lg animate-fade-in"
        >
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-warning-foreground text-sm">{alert.message}</p>
          <button
            onClick={() => onDismiss(index)}
            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-warning-foreground hover:bg-warning/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
