import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  image: File | null;
  preview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
}

export const ImageUpload = ({ image, preview, onImageChange }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageChange(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onImageChange(null, null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onImageChange]);

  if (preview) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Immagine principale del prodotto
        </label>
        <div className="relative inline-block">
          <div className="w-40 h-40 rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">
        Immagine principale del prodotto
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-muted-foreground hover:bg-muted/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            {isDragging ? (
              <ImageIcon className="w-6 h-6" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div className="text-center">
            <p className="font-medium">
              {isDragging ? "Rilascia l'immagine" : "Trascina un'immagine qui"}
            </p>
            <p className="text-sm mt-1">oppure clicca per caricare</p>
          </div>
          <p className="text-xs">JPG, PNG, WebP</p>
        </div>
      </div>
    </div>
  );
};
