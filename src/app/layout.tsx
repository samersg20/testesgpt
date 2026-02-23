import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeLabel",
  description: "Etiquetas de segurança alimentar",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="mx-auto max-w-6xl p-6 font-sans">{children}</body>
    </html>
  );
}
