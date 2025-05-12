"use client";

import { Pill, BellRing, Bot } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          💊 Welcome to MedRem
        </h1>
        <p className="text-gray-700 text-lg max-w-xl mx-auto mb-10">
          Your smart medicine assistant – track your medicines, set up timely
          reminders, and get instant answers to your health queries.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-3 px-4">
        {/* Feature 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Pill className="text-blue-600 w-6 h-6" />
            <h2 className="text-xl font-semibold">Track Medicines</h2>
          </div>
          <p className="text-gray-600">
            View, add, and manage your medication schedule effortlessly.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <BellRing className="text-green-600 w-6 h-6" />
            <h2 className="text-xl font-semibold">Smart Reminders</h2>
          </div>
          <p className="text-gray-600">
            Get reminders via Email, SMS, or WhatsApp exactly when you need
            them.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="text-purple-600 w-6 h-6" />
            <h2 className="text-xl font-semibold">AI Chatbot</h2>
          </div>
          <p className="text-gray-600">
            Ask health-related questions and get instant intelligent responses.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition">
          Get Started
        </button>
      </div>
    </main>
  );
}
