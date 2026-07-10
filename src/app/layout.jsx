import "@/styles/globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Aura Studio | Visual Page Builder & CMS",
  description: "Craft, style, and publish high-performance glassmorphic web pages with visual blocks.",
};

export const viewport = {
  themeColor: "#080b11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark`}>
      <body className={`${plusJakarta.className} bg-[#080b11] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

