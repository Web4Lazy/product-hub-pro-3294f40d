import { CheckCircle, ExternalLink, Plus } from "lucide-react";
import { Marketplace } from "@/types/product";

interface SuccessPageProps {
  asin: string;
  client: string;
  marketplace: Marketplace;
  title: string;
  price: number;
  onReset: () => void;
}

export const SuccessPage = ({
  asin,
  client,
  marketplace,
  title,
  price,
  onReset,
}: SuccessPageProps) => {
  const amazonUrl = `https://${marketplace.domain}/dp/${asin}`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl animate-fade-in">
      <div className="bg-success/10 border border-success rounded-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-success-foreground" />
        </div>

        <h2 className="text-2xl font-bold text-success-foreground mb-2">
          Prodotto caricato con successo!
        </h2>

        <div className="mt-8 space-y-4 text-left bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">ASIN</span>
            <span className="font-mono font-semibold text-foreground">{asin}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Cliente</span>
            <span className="font-medium text-foreground">{client}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Marketplace</span>
            <span className="font-medium text-foreground">
              {marketplace.flag} {marketplace.country} ({marketplace.domain})
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Titolo</span>
            <span className="font-medium text-foreground text-right max-w-[60%] truncate">
              {title}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Prezzo</span>
            <span className="font-semibold text-foreground">€{price.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold transition-all duration-200 hover:bg-primary/90"
          >
            <Plus className="w-5 h-5" />
            <span>Carica un altro prodotto</span>
          </button>
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-border text-foreground rounded-lg font-semibold transition-all duration-200 hover:bg-muted"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Vai su Amazon</span>
          </a>
        </div>
      </div>
    </div>
  );
};
