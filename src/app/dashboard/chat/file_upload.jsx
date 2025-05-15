"use client";

import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function FileUpload({ setFileName }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileUploadButtonClick = () => {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "application/pdf");

    fileInput.addEventListener("change", async () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files.item(0);

        if (file) {
          setIsUploading(true);
          setError(null);

          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 95) {
                clearInterval(progressInterval);
                return 95;
              }
              return prev + 5;
            });
          }, 100);

          try {
            const formData = new FormData();
            formData.append("pdf", file);

            const res = await fetch("../api/upload-prescription", {
              method: "POST",
              body: formData,
            });

            clearInterval(progressInterval);

            if (!res.ok) {
              throw new Error("Upload failed");
            }

            const data = await res.json();
            console.log("Uploaded:", data.fileName);
            setFileName(data.fileName);
            setUploadProgress(100);

            // Reset progress after a delay
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
            }, 1000);
          } catch (err) {
            clearInterval(progressInterval);
            setError("Upload failed. Please try again.");
            setIsUploading(false);
            setUploadProgress(0);
          }
        }
      }
    });

    fileInput.click();
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleFileUploadButtonClick}
        className="w-full h-32 flex flex-col gap-2 border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300"
        disabled={isUploading}
      >
        <Upload className="h-8 w-8 text-blue-600" />
        <span className="font-medium">
          {isUploading ? "Uploading..." : "Upload PDF"}
        </span>
        <span className="text-xs text-muted-foreground">
          Click to browse files
        </span>
      </Button>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Uploading document...</span>
            </div>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1" />
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
