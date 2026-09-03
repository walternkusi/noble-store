import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NOBLE store",
  description: "Discover your unique style with our curated collection of trendy dresses and shoes.",
  authors: [{ name: "Nkusi Walter", url: "https://github.com/Nkusi-Walter" }],
  keywords: ["Nkusi Walter", "Noble Store developer", "developed by Nkusi Walter"],
  creator: "Nkusi Walter",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NOBLE store",
  description: "Discover your unique style with our curated collection of trendy dresses and shoes.",
  author: {
    "@type": "Person",
    name: "Nkusi Walter",
  },
  creator: {
    "@type": "Person",
    name: "Nkusi Walter",
  },
  copyrightHolder: {
    "@type": "Person",
    name: "Nkusi Walter",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
