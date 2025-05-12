// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Medicine Reminder App",
  description: "Track and get reminded about your medications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
