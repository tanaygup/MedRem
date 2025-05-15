// app/ask/route.js
export const runtime='nodejs';
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);

export async function POST(req) {
  const { question, fileName } = await req.json();

  try {
    let prompt;

    if (fileName) {
      // --- PDF‑based question ---
      const txtPath = path.join(
        process.cwd(),
        "/public/uploads",
        `${fileName}`
      );
      const fileText = fs.readFileSync(txtPath, "utf8");
      prompt = [
        "You are a helpful assistant.",
        "Answer the following question based on the text from a PDF:",
        "",
        fileText,
        "",
        `Question: ${question}`,
      ].join("\n");
    } else {
      // --- General health question ---
      prompt = [
        "You are a knowledgeable health assistant.",
        "Answer the following general health question concisely:",
        "",
        question,
      ].join("\n");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const generation = await model.generateContent(prompt);
    const answer = await generation.response.text();

    return NextResponse.json({ answer:answer }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    // On error, always return JSON with an `answer` string
    return NextResponse.json(
      { answer: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
