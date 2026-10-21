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

const description =
  "Maison SN — Style & Beauté. Parfums, vêtements, chaussures et accessoires choisis pour leur ligne. Livraison offerte dès 150 €, échanges sous 14 jours.";

export const metadata = {
  title: {
    default: "Style & Beauté — Parfums, vêtements, chaussures, accessoires",
    template: "%s — Style & Beauté",
  },
  description,
  applicationName: "Style & Beauté",
  openGraph: {
    title: "Style & Beauté — Maison SN",
    description,
    siteName: "Style & Beauté",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/sn.jpg", width: 1254, height: 1254, alt: "Sceau Style & Beauté, maison SN" }],
  },
  twitter: {
    card: "summary",
    title: "Style & Beauté — Maison SN",
    description,
    images: ["/sn.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144.png", sizes: "144x144", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
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
