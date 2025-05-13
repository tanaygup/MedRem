"use client";

import React, { useState } from "react";

function ChatComponent({ fileName }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestion = async () => {
    if (!fileName) {
      alert("Please upload a PDF first.");
      return;
    }

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, fileName }),
    });

    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div className="p-4">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about the PDF..."
        className="w-full p-2 bg-gray-800 text-white rounded"
      />
      <button
        onClick={askQuestion}
        className="mt-2 bg-blue-600 px-4 py-2 rounded text-white"
      >
        Ask
      </button>

      {answer && (
        <div className="mt-4 bg-gray-700 p-4 rounded">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default ChatComponent;
