import type { Metadata } from "next";
import React from "react";
import { ReactQueryProvider } from "@/lib/react-query";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coolify Hello World - System Info Terminal",
  description:
    "A terminal-style system information display for Coolify deployment testing",
  keywords: ["coolify", "system info", "docker", "terminal", "monitoring"],
  authors: [{ name: "System Admin" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Coolify Hello World - System Info Terminal",
    description:
      "A terminal-style system information display for Coolify deployment testing",
    type: "website",
    locale: "en_US",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="h-full bg-terminal-bg text-terminal-green font-mono antialiased bg-scan">
        <div className="matrix-bg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-terminal-bg/20" />
        </div>

        <ReactQueryProvider>
          <div className="relative min-h-full flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>

            <footer className="border-t border-terminal-green/20 py-4 text-center text-xs text-terminal-green/50">
              <div className="container mx-auto px-4">
                <p>
                  Coolify Hello World v1.0.0 | System Information Terminal |
                  <span className="text-terminal-cyan">
                    {" "}
                    Powered by Next.js & Docker
                  </span>
                </p>
              </div>
            </footer>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
