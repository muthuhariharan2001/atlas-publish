import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: string;
  required?: boolean;
}

export const ImageUpload = ({ 
  label, 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 5,
  preview,
  required = false 
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (file) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        onFileSelect(null);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        onFileSelect(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    setError("");
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()}>
        {label} {required && "*"}
      </Label>
      
      {!previewUrl ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="cursor-pointer text-primary hover:underline">
                Click to upload
              </Label>
              {" "}or drag and drop
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to {maxSize}MB
            </p>
          </div>
          <Input
            id={label.replace(/\s+/g, '-').toLowerCase()}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            required={required}
          />
        </div>
      ) : (
        <div className="relative group rounded-lg overflow-hidden border border-border">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
