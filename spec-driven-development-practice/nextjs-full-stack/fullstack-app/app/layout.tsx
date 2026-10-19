import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./web/globals.css";

export const metadata: Metadata = {
  title: "Slot Reservation App",
  description: "Reserve limited-capacity slots for users",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
