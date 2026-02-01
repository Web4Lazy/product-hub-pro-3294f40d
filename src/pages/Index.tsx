import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { HomePage } from "@/pages/HomePage";
import { PreviewPage } from "@/pages/PreviewPage";
import { SuccessPage } from "@/pages/SuccessPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AnalyzeResponse, Marketplace } from "@/types/product";

type Page = "home" | "preview" | "settings" | "success";

interface PreviewData {
  response: AnalyzeResponse;
  client: string;
  marketplace: Marketplace;
  image: File;
  imagePreview: string;
}

interface SuccessData {
  asin: string;
  client: string;
  marketplace: Marketplace;
  title: string;
  price: number;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const handleNavigate = useCallback((page: "home" | "preview" | "settings") => {
    setCurrentPage(page);
  }, []);

  const handleAnalyzeComplete = useCallback(
    (
      response: AnalyzeResponse,
      client: string,
      marketplace: Marketplace,
      image: File,
      imagePreview: string
    ) => {
      setPreviewData({ response, client, marketplace, image, imagePreview });
      setCurrentPage("preview");
    },
    []
  );

  const handleUploadSuccess = useCallback(
    (asin: string) => {
      if (previewData) {
        setSuccessData({
          asin,
          client: previewData.client,
          marketplace: previewData.marketplace,
          title: previewData.response.product.title,
          price: previewData.response.product.price,
        });
        setCurrentPage("success");
      }
    },
    [previewData]
  );

  const handleReset = useCallback(() => {
    setPreviewData(null);
    setSuccessData(null);
    setCurrentPage("home");
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentPage("home");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentPage={currentPage === "success" ? "home" : currentPage}
        onNavigate={handleNavigate}
      />
      
      <main>
        {currentPage === "home" && (
          <HomePage onAnalyzeComplete={handleAnalyzeComplete} />
        )}
        
        {currentPage === "preview" && previewData && (
          <PreviewPage
            alerts={previewData.response.alerts}
            product={previewData.response.product}
            client={previewData.client}
            marketplace={previewData.marketplace}
            imagePreview={previewData.imagePreview}
            imageFile={previewData.image}
            onBack={handleBackToHome}
            onSuccess={handleUploadSuccess}
          />
        )}
        
        {currentPage === "success" && successData && (
          <SuccessPage
            asin={successData.asin}
            client={successData.client}
            marketplace={successData.marketplace}
            title={successData.title}
            price={successData.price}
            onReset={handleReset}
          />
        )}
        
        {currentPage === "settings" && <SettingsPage />}
      </main>
    </div>
  );
};

export default Index;
