import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MN Corredores CRM",
  description: "CRM demo para gestion comercial de MN Corredores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
