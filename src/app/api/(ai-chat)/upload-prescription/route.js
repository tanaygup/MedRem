// app/api/upload-prescription/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

// 1️⃣ Disable built‑in body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// 2️⃣ Ensure required directories
const uploadDir = path.join(process.cwd(), "public", "uploads");
const processedDir = path.join(process.cwd(), "public", "processed");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

export async function POST(request) {
  try {
    // 3️⃣ Parse incoming form-data
    const formData = await request.formData();
    const file = formData.get("pdf");

    // 4️⃣ Validate
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF uploads are allowed." }, { status: 415 });
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10 MB)." }, { status: 413 });
    }

    // 5️⃣ Save the PDF to /uploads
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    // 6️⃣ Parse the PDF
    const data = await pdf(buffer);
    const extractedText = data.text;

    // 7️⃣ Save the text to /processed
    const txtFilename = `${filename}.txt`;
    const txtPath = path.join(processedDir, txtFilename);
    await fs.promises.writeFile(txtPath, extractedText, "utf8");

    // 8️⃣ Return just the PDF name (you’ll use it later to access the `.txt`)
    return NextResponse.json({ fileName: filename }, { status: 200 });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error during upload." }, { status: 500 });
  }
}
