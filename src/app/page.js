"use client";
import Link from "next/link";
import { Pill, Bell, MessageSquare, ArrowRight } from "lucide-react";
import { redirectToSignUp } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-10 h-5">
              <div className="absolute w-10 h-5 bg-red-500 rounded-full"></div>
              <div className="absolute w-5 h-5 right-0 bg-yellow-400 rounded-full"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
              Welcome to MedRem
            </h1>
          </div>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg md:text-xl">
            Your smart medicine assistant – track your medicines, set up timely
            reminders, and get instant answers to your health queries.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Track Medicines Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 ml-3">
                Track Medicines
              </h2>
            </div>
            <p className="text-gray-600">
              View, add, and manage your medication schedule effortlessly.
            </p>
          </div>

          {/* Smart Reminders Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 ml-3">
                Smart Reminders
              </h2>
            </div>
            <p className="text-gray-600">
              Get reminders via Email, SMS, or WhatsApp exactly when you need
              them.
            </p>
          </div>

          {/* AI Chatbot Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 ml-3">
                AI Chatbot
              </h2>
            </div>
            <p className="text-gray-600">
              Ask health-related questions and get instant intelligent
              responses.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full flex items-center gap-2 transform transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Additional Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose MedRem?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to make managing your medications simple,
              reliable, and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Never Miss a Dose
              </h3>
              <p className="text-gray-600">
                Our smart reminder system ensures you take your medications on
                time, every time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure Health Data
              </h3>
              <p className="text-gray-600">
                Your medical information is encrypted and securely stored with
                industry-leading protection.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Family Sharing
              </h3>
              <p className="text-gray-600">
                Manage medications for your loved ones and share schedules with
                caregivers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Health Insights
              </h3>
              <p className="text-gray-600">
                Get personalized insights about your medication patterns and
                health trends.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-32 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              What Our Users Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">
                &quot;MedRem has completely changed how I manage my medications.
                The reminders are reliable and the interface is so easy to
                use.&quot;
              </p>
              <p className="font-medium text-gray-800">- Sarah J.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">
                &quot;As a caregiver for my elderly mother, MedRem gives me
                peace of mind knowing she&apos;ll never miss her important
                medications.&quot;
              </p>
              <p className="font-medium text-gray-800">- Michael T.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600 italic mb-4">
                &quot;The AI chatbot is surprisingly helpful. I can quickly get
                answers about my medications without having to call my
                doctor.&quot;
              </p>
              <p className="font-medium text-gray-800">- Lisa R.</p>
            </div>
          </div>
        </div>

        {/* Footer with CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Ready to take control of your medication management?
          </h2>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full inline-flex items-center gap-2 transform transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get Started Today
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
