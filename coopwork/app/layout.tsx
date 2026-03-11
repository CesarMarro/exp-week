import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoopWork — Construye proyectos reales",
  description:
    "Plataforma colaborativa donde los equipos reparten ganancias con justicia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} bg-slate-900 font-sans antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
