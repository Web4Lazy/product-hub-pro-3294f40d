import { useState, useCallback } from "react";
import { ArrowLeft, ExternalLink, Upload, Save } from "lucide-react";
import { AlertBanner } from "@/components/AlertBanner";
import { AiBadge } from "@/components/AiBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, Marketplace, ProductData, UploadResponse } from "@/types/product";

interface PreviewPageProps {
  alerts: Alert[];
  product: ProductData;
  client: string;
  marketplace: Marketplace;
  imagePreview: string;
  imageFile: File;
  onBack: () => void;
  onSuccess: (asin: string) => void;
}

export const PreviewPage = ({
  alerts: initialAlerts,
  product: initialProduct,
  client,
  marketplace,
  imagePreview,
  imageFile,
  onBack,
  onSuccess,
}: PreviewPageProps) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [product, setProduct] = useState(initialProduct);
  const [useUserCategory, setUseUserCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDismissAlert = useCallback((index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleFieldChange = useCallback(
    (field: keyof ProductData, value: string | number | string[]) => {
      setProduct((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleBulletPointChange = useCallback((index: number, value: string) => {
    setProduct((prev) => ({
      ...prev,
      bullet_points: prev.bullet_points.map((bp, i) => (i === index ? value : bp)),
    }));
  }, []);

  const handleUpload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("product", JSON.stringify({
        ...product,
        category: useUserCategory ? product.category_user : product.category_suggested,
      }));
      formData.append("client", client);
      formData.append("marketplace", JSON.stringify(marketplace));
      formData.append("image", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Errore durante il caricamento: ${response.status}`);
      }

      const data: UploadResponse = await response.json();
      if (data.success && data.asin) {
        onSuccess(data.asin);
      } else {
        throw new Error("Caricamento fallito");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Si è verificato un errore durante il caricamento");
    } finally {
      setIsLoading(false);
    }
  };

  const showCategoryChoice =
    product.category_user &&
    product.category_suggested &&
    product.category_user !== product.category_suggested;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Torna indietro</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Preview</h2>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1.5 bg-accent/20 text-accent rounded-lg text-sm font-medium">
            Cliente: {client}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 bg-success/20 text-success-foreground rounded-lg text-sm font-medium">
            {marketplace.flag} Mercato: {marketplace.country} — Ottimizzato in {marketplace.language}
          </span>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="mb-6">
          <AlertBanner alerts={alerts} onDismiss={handleDismissAlert} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-card space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Titolo prodotto
                </label>
                <div className="flex items-center gap-2">
                  <AiBadge />
                  <span
                    className={`text-xs ${
                      product.title.length > 250 ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {product.title.length}/250
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={product.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                maxLength={250}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Marca</label>
                <AiBadge />
              </div>
              <input
                type="text"
                value={product.brand}
                onChange={(e) => handleFieldChange("brand", e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>

            {/* EAN & Price row */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">EAN</label>
                  <AiBadge />
                </div>
                <input
                  type="text"
                  value={product.ean}
                  onChange={(e) => handleFieldChange("ean", e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Prezzo (€)</label>
                  <AiBadge />
                </div>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => handleFieldChange("price", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                <AiBadge />
              </div>
              {showCategoryChoice ? (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={!useUserCategory}
                      onChange={() => setUseUserCategory(false)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="text-foreground">{product.category_suggested}</span>
                      <span className="ml-2 text-xs text-accent">(Suggerita AI)</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={useUserCategory}
                      onChange={() => setUseUserCategory(true)}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="text-muted-foreground">{product.category_user}</span>
                      <span className="ml-2 text-xs text-muted-foreground">(Originale)</span>
                    </div>
                  </label>
                </div>
              ) : (
                <input
                  type="text"
                  value={product.category_suggested || product.category_user}
                  onChange={(e) => handleFieldChange("category_suggested", e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Descrizione principale
                </label>
                <AiBadge />
              </div>
              <textarea
                value={product.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="w-full min-h-[120px] px-4 py-3 bg-input border border-border rounded-lg text-foreground resize-y focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
            </div>

            {/* Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Bullet Points</label>
                <AiBadge />
              </div>
              {product.bullet_points.map((bp, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => handleBulletPointChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image preview column */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <label className="block text-sm font-medium text-muted-foreground mb-3">
              Immagine principale
            </label>
            <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner message="Caricamento in corso su Amazon..." />
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleUpload}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold transition-all duration-200 hover:bg-primary/90"
              >
                <Upload className="w-5 h-5" />
                <span>Conferma e Carica su Amazon</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg font-medium transition-all duration-200 hover:bg-muted">
                <Save className="w-4 h-4" />
                <span>Salva come bozza</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
