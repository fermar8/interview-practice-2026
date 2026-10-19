import type { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      <Footer />
    </div>
  );
}
