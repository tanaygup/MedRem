"use client";

import { useState } from "react";
import FileUploadComponent from "./file_upload";
import ChatComponent from "./chat";

export default function Home() {
  const [fileName, setFileName] = useState(""); // 🔹 New state

  return (
    <div className="min-h-screen w-screen flex">
      <div className="w-[30vw] min-h-screen p-4 flex justify-center items-center">
        <FileUploadComponent setFileName={setFileName} />
      </div>
      <div className="w-[70vw] min-h-screen border-l-2">
        <ChatComponent fileName={fileName} />
      </div>
    </div>
  );
}
