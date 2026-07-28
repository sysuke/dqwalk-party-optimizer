import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DQ Walk パーティ編成オプティマイザ",
  description: "装備・こころ・ジョブレベルから最適パーティを提案",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-dq-cream text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
