"use client";

import React from "react";
import { Upload } from "lucide-react";

function FileUploadComponent({ setFileName }) {
  const handleFileUploadButtonClick = () => {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "application/pdf");

    fileInput.addEventListener("change", async () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files.item(0);

        if (file) {
          const formData = new FormData();
          formData.append("pdf", file);

          const res = await fetch("http://localhost:8000/upload/pdf", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          console.log("Uploaded:", data.fileName);
          setFileName(data.fileName); // 🔹 Update state with uploaded filename
        }
      }
    });

    fileInput.click();
  };

  return (
    <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white border-2">
      <div
        onClick={handleFileUploadButtonClick}
        className="flex justify-center items-center flex-col"
      >
        <h3>Upload PDF File</h3>
        <Upload />
      </div>
    </div>
  );
}

export default FileUploadComponent;
