import { Sparkles } from "lucide-react";

export const AiBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-md">
      <Sparkles className="w-3 h-3" />
      AI
    </span>
  );
};
