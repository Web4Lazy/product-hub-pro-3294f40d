import { useState, useCallback } from "react";
import { CustomSelect } from "@/components/CustomSelect";
import { ImageUpload } from "@/components/ImageUpload";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CLIENTS, MARKETPLACES, Marketplace, AnalyzeResponse } from "@/types/product";
import { ArrowRight } from "lucide-react";

interface HomePageProps {
  onAnalyzeComplete: (
    data: AnalyzeResponse,
    client: string,
    marketplace: Marketplace,
    image: File,
    imagePreview: string
  ) => void;
}

export const HomePage = ({ onAnalyzeComplete }: HomePageProps) => {
  const [client, setClient] = useState(CLIENTS[0]);
  const [marketplace, setMarketplace] = useState<Marketplace>(MARKETPLACES[0]);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = useCallback(
    (file: File | null, preview: string | null) => {
      setImage(file);
      setImagePreview(preview);
      setError(null);
    },
    []
  );

  const isFormValid = prompt.trim().length > 0 && image !== null;

  const handleAnalyze = async () => {
    if (!isFormValid || !image || !imagePreview) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("marketplace", JSON.stringify(marketplace));
      formData.append("client", client);
      formData.append("image", image);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Errore durante l'analisi: ${response.status}`);
      }

      const data: AnalyzeResponse = await response.json();
      onAnalyzeComplete(data, client, marketplace, image, imagePreview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore durante l'analisi");
    } finally {
      setIsLoading(false);
    }
  };

  const clientOptions = CLIENTS.map((c) => ({ value: c, label: c }));
  const marketplaceOptions = MARKETPLACES.map((m) => ({
    value: m.country,
    label: m.country,
    sublabel: m.domain,
    flag: m.flag,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground">Carica un nuovo prodotto</h2>
          <p className="text-muted-foreground mt-2">
            Inserisci le informazioni del prodotto per l'analisi e l'ottimizzazione AI
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <CustomSelect
              label="Cliente"
              value={client}
              options={clientOptions}
              onChange={setClient}
            />

            <CustomSelect
              label="Mercato di destinazione"
              value={marketplace.country}
              options={marketplaceOptions}
              onChange={(country) => {
                const m = MARKETPLACES.find((mk) => mk.country === country);
                if (m) setMarketplace(m);
              }}
              renderOption={(opt) => (
                <span className="flex items-center gap-2">
                  <span>{(opt as any).flag}</span>
                  <span>{opt.label}</span>
                  {opt.sublabel && (
                    <span className="text-muted-foreground text-sm">({opt.sublabel})</span>
                  )}
                </span>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Descrizione del prodotto
            </label>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError(null);
              }}
              placeholder="Incolla qui le informazioni sul prodotto in modo discorsivo. Includi nome, codice EAN o ASIN, prezzo e la categoria desiderata."
              className="w-full min-h-[200px] px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-y focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            />
          </div>

          <ImageUpload
            image={image}
            preview={imagePreview}
            onImageChange={handleImageChange}
          />

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner
              message={`Claude sta analizzando il prodotto per il mercato ${marketplace.country}...`}
            />
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={!isFormValid}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              <span>Analizza Prodotto</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
