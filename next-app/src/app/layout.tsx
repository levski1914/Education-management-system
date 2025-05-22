"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/providers/theme-provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { checkServerHealth } from "./utils/serverStatus";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(()=>{
    checkServerHealth();

    // const interval = setInterval(()=>{
    //   checkServerHealth();
    // },600000)

    // return()=>clearInterval(interval)
  },[])
  return (
    <html lang="en">
      <body
      ><ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
           <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >

        {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
