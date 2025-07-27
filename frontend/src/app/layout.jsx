import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@/components/Toaster";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import Toaster from "@/components/Toaster";
import StoreProvider from "@/store/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nayak Enterprises - Wholesale Distribution",
  description:
    "Your trusted wholesale partner for quality products. We supply retailers and shopkeepers with premium merchandise at competitive prices.",
  keywords: "wholesale, distribution, retail, shopkeepers, Nayak Enterprises"
  
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning> 
      <body>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* Hide Navbar on /admin routes using ClientNavbar */}
            <ClientNavbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
