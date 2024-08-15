import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from '@next/third-parties/google'

const IBMPlex = IBM_Plex_Sans(
  { 
    subsets: ["latin"],
    weight:["400", "500","600","700"],
    variable:"--font-ibm-plex"
});


export const metadata: Metadata = {
  title: "Data Analyst ToolBot",
  description: "Data Analyst ToolBot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables:{
        colorPrimary:"#624cf5"
      }
    }}>
    <html lang="en">
      <body className={cn("font-IBMPlex antialiased", IBMPlex.variable, "hide-scrollbar")}>
      <div className="main">
          <div className="gradient" />
      </div>
        {children}
        </body>
        <GoogleAnalytics gaId="G-YCE58EK04E" />
    </html>
    </ClerkProvider>
  );
}


