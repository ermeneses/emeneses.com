import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eduardo Meneses | Portfolio",
  description: "Portfolio de Eduardo Meneses Denis, Ingeniero Industrial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
