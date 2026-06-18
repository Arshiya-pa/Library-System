"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/Store";
import toast, { Toaster } from "react-hot-toast";
import Handler from "@/components/Handler";

export default function RootLayout({children,}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Toaster />
         <Handler>
          {children}
          </Handler>
        </Provider>
      </body>
    </html>
  );
}
