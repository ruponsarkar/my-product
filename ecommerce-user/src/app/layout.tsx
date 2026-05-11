import './globals.css';
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: 'E-Commerce Store',
  description: 'Shop your favorite products online',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-[var(--paper)] text-[var(--ink)]`}>
        <CartProvider>
          <main className="min-h-screen px-4 py-6 md:px-8">
            <SiteHeader />
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
