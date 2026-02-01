import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps<T> {
  label: string;
  value: T;
  options: { value: T; label: string; sublabel?: string }[];
  onChange: (value: T) => void;
  renderOption?: (option: { value: T; label: string; sublabel?: string }) => React.ReactNode;
}

export function CustomSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  renderOption,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-input border border-border rounded-lg text-foreground hover:border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 text-left"
        >
          <span className="flex items-center gap-2">
            {renderOption && selectedOption
              ? renderOption(selectedOption)
              : selectedOption?.label}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-card overflow-hidden animate-fade-in">
            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              {options.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors duration-150 ${
                    option.value === value ? "bg-muted" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {renderOption ? renderOption(option) : option.label}
                  </span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
