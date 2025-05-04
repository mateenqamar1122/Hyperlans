
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Upload, X, Image } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/services/fileUploadService";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  bucket: string;
  folder?: string;
  title?: string;
  description?: string;
  aspectRatio?: string;
  maxSizeMB?: number;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonText?: string;
  allowedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  bucket,
  folder = '',
  title = "Upload Image",
  description = "Select an image to upload",
  aspectRatio = "16/9",
  maxSizeMB = 5,
  buttonVariant = "outline",
  buttonText = "Upload Image",
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const imageUrl = await uploadFile(selectedFile, bucket, folder);
      
      if (imageUrl) {
        onImageUploaded(imageUrl);
        toast.success("Image uploaded successfully");
        setOpen(false);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOpen(false);
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <>
      <Button 
        variant={buttonVariant} 
        size="sm" 
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {buttonText}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {previewUrl ? (
              <div className="relative">
                <div 
                  style={{ 
                    aspectRatio, 
                    backgroundImage: `url(${previewUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }} 
                  className="w-full rounded-md border overflow-hidden"
                />
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={clearPreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label 
                htmlFor="image-upload" 
                className="flex flex-col items-center justify-center gap-2 cursor-pointer p-6 border-2 border-dashed rounded-md border-muted-foreground/25 hover:border-primary/50 transition-colors"
                style={{ aspectRatio }}
              >
                <Image className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to select an image
                </span>
              </label>
            )}
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={allowedTypes.join(',')}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
