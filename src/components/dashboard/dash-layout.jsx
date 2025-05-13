"use client";

import React from "react";

import { useState } from "react";
import DashboardSidebar from "./sidebar";
import DashboardNavbar from "./navbar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <DashboardNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
