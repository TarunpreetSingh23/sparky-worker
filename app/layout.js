import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import toast from "react-hot-toast";
// import { Toaster } from "react-hot-toast";

import SessionWrapper from "@/components/SessionWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shop ON",
  description: "this is leading e commerse paltform ",
};

export default function RootLayout({ children }) {
  return (



    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
        
  {/* <Navbar /> */}
          <div className="min-h-screen bg-[#e3e6f3]">

            {children}
              {/* <Toaster position="top-right" reverseOrder={false} /> */}
          </div>
          {/* <Footer /> */}
        </SessionWrapper>
      </body>
    </html>
  );
}
