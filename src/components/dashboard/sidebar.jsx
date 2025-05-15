"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/utils/constants.js";
export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-30 h-full bg-white shadow-lg transition-all duration-300 transform",
          open ? "w-64" : "w-20",
          "md:translate-x-0",
          !open && "md:w-20",
          !open && !open && "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-4">
              <div className="absolute w-8 h-4 bg-red-500 rounded-full"></div>
              <div className="absolute w-4 h-4 right-0 bg-yellow-400 rounded-full"></div>
            </div>
            {open && (
              <span className="font-bold text-xl text-blue-600">MedRem</span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded-full hover:bg-gray-100 md:block hidden"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform",
                !open && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100",
                !open && "justify-center"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  pathname === item.href ? "text-blue-600" : "text-gray-500"
                )}
              />
              {open && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-2 border-t">
          <button
            className={cn(
              "flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors",
              !open && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 text-gray-500" />
            {open && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
