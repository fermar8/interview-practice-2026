import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Slot Reservation App",
  description: "Reserve limited-capacity slots for users",
};

export default function WebLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
