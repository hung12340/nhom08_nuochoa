import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/Chatbot";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["vietnamese", "latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["vietnamese", "latin"],
});

export const metadata: Metadata = {
  title: "Aromis – Đẳng cấp đến từ sự chân thực",
  description: "Cửa hàng nước hoa cao cấp Aromis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} ${playfair.variable} h-full antialiased`}
    >
      {/* Set màu nền, màu chữ và font mặc định cho toàn bộ website */}
      <body className="min-h-full flex flex-col bg-[#F9F9F9] text-[#1A1A1A] font-sans">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Chatbot />
      </body>
    </html>
  );
}