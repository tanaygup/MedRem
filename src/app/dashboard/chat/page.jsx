"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "./file_upload";
import { ChatInterface } from "./chat";
import { Bot, FileText, HelpCircle, Upload } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dash-layout";

export default function ChatPage() {
  const [fileName, setFileName] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Health Chat</h1>
          <p className="text-muted-foreground">
            Upload your prescriptions and medical documents to get AI-powered
            assistance and answers to your health questions.
          </p>
        </div>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>Chat Assistant</span>
            </TabsTrigger>
            <TabsTrigger
              value="how-it-works"
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span>How It Works</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-blue-600" />
                      Document Upload
                    </CardTitle>
                    <CardDescription>
                      Upload your medical documents or prescriptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload setFileName={setFileName} />

                    {fileName && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            Uploaded: {fileName}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      <h4 className="text-sm font-medium">
                        What you can upload:
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          <span>Prescription documents (PDF)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          <span>Medical reports</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          <span>Lab test results</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-blue-600" />
                      AI Health Assistant
                    </CardTitle>
                    <CardDescription>
                      Ask questions about your uploaded documents or general
                      health queries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-5rem)]">
                    <ChatInterface fileName={fileName} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="how-it-works">
            <Card>
              <CardHeader>
                <CardTitle>How to Use the AI Health Chat</CardTitle>
                <CardDescription>
                  Follow these steps to get the most out of your AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-card">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        1. Upload Your Document
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Start by uploading your prescription or medical document
                        in PDF format.
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-card">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        2. Document Processing
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI system analyzes and extracts information from
                        your document.
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-card">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        <Bot className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        3. Ask Questions
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Ask specific questions about your document or general
                        health queries.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Example Questions You Can Ask:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                        "What are the potential side effects of the medications
                        in my prescription?"
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                        "Can you explain what this lab result means in simple
                        terms?"
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                        "Are there any drug interactions I should be aware of?"
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                        "What is the recommended dosage for this medication?"
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <h3 className="text-amber-800 font-medium mb-2 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Important Note
                    </h3>
                    <p className="text-amber-700 text-sm">
                      While our AI assistant provides helpful information, it
                      should not replace professional medical advice. Always
                      consult with your healthcare provider for medical
                      decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
