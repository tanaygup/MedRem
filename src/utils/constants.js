 import {
   LayoutDashboard,
   Pill,
   CalendarClock,
   Bell,
   MessageSquare,
   BarChart3,
   Settings,
   HelpCircle,
   ChevronLeft,
   LogOut,
 } from "lucide-react";
 
 export const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Medications", href: "/dashboard/medications", icon: Pill },
    {
      name: "Appointments",
      href: "/dashboard/appointments",
      icon: CalendarClock,
    },
    { name: "Reminders", href: "/dashboard/reminders", icon: Bell },
    { name: "AI Health Chat", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ];