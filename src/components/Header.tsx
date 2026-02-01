import { Package, Settings, Home } from "lucide-react";

interface HeaderProps {
  currentPage: "home" | "preview" | "settings";
  onNavigate: (page: "home" | "preview" | "settings") => void;
}

export const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">ProductLoader</h1>
        </div>
        
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onNavigate("home")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === "home"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Home</span>
          </button>
          <button
            onClick={() => onNavigate("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === "settings"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
