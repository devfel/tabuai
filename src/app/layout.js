import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { GoogleTagManager } from "@next/third-parties/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TABUai",
  description: "Website para vender e comprar board games de outros usuários.",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="pt">
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      </html>
    </AuthProvider>
  );
}
