import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { CatalogProvider } from "@/app/components/CatalogContext";
import { CartProvider } from "@/app/components/CartContext";
import { UserProvider } from "@/app/components/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Riya Art Palace",
  description: "Handmade Crafts & Decor",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <CatalogProvider>
          <UserProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </UserProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}