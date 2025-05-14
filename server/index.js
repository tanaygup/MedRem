const cors = require("cors");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config({path:'.env.local'});

const apiKey ="AIzaSyDKtX0Qk5Py-7_WYuVTTZLJJXfpny3XrSg";
const app = express();
const port = 8000;

const genAI = new GoogleGenerativeAI(apiKey);

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Upload and process PDF
app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  const pdfPath = req.file.path;
  const processedPath = `processed/${req.file.filename}.txt`;

  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    const pdfText = data.text;

    // Save extracted text
    if (!fs.existsSync("processed")) {
      fs.mkdirSync("processed");
    }

    fs.writeFileSync(processedPath, pdfText);
    res.json({ message: "uploaded", fileName: req.file.filename });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// Ask question about the PDF
app.post("/ask", async (req, res) => {
  const { question, fileName } = req.body;

  try {
    const fileText = fs.readFileSync(`processed/${fileName}.txt`, "utf8");

    const prompt = `You are a helpful assistant. Answer the following question based on the text from a PDF:\n\n${fileText}\n\nQuestion: ${question}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate answer." });
  }
});

app.post("/general-health", async (req, res) => {
  const { question } = req.body;
  try {
    const prompt = `You are a knowledgeable health assistant. Answer the following general health question concisely:\n\n${question}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const answer = await (await result.response).text();

    res.json({ answer });
  } catch (err) {
    console.error("General health error:", err);
    res.status(500).json({ answer: "Failed to generate answer." });
  }
});

// Add this somewhere in your setup, perhaps before the app.listen
// async function listModels() {
//   try {
//     const modelList = await genAI.listModels();
//     for await (const m of modelList) {
//       console.log(
//         "Model name:",
//         m.name,
//         "Supported methods:",
//         m.supportedGenerationMethods
//       );
//     }
//   } catch (error) {
//     console.error("Error listing models:", error);
//   }
// }

// listModels(); // Call this function to see the output in your console when the server starts

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
