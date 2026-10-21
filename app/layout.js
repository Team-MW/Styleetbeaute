import { Cormorant_Garamond, Jost } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Shell } from "@/components/Shell";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Style & Beauté — Parfums, vêtements, chaussures, accessoires",
    template: "%s — Style & Beauté",
  },
  description: "Style & Beauté — parfums, vêtements, chaussures et accessoires. Une maison, une sélection courte, une allure nette.",
  openGraph: {
    title: "Style & Beauté",
    description: "Parfums, vêtements, chaussures et accessoires. La maison SN.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.jpg",
  },
};

export const viewport = {
  themeColor: "#070707",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={serif.variable + " " + sans.variable}>
      <body>
        <CartProvider>
          <Shell>{children}</Shell>
        </CartProvider>
      </body>
    </html>
  );
}
