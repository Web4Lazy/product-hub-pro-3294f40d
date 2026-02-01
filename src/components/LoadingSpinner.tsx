import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-muted"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin-slow"></div>
      </div>
      {message && (
        <p className="text-muted-foreground text-center font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
