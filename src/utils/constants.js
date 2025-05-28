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
  ClipboardList,
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

  {
    name: "Prescriptions",
    href: "/dashboard/prescriptions",
    icon: ClipboardList,
  },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

// utils/dateTime.ts

/**
 * Format an ISO date string (or timestamp) into "DD/MM/YYYY"
 */
export function formatDate(input) {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleDateString("en-GB");
}

export function formatTime(time24, locale = "en-US") {
  const [hourStr, minuteStr] = time24.split(":");
  const date = new Date();
  date.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10), 0, 0);
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
