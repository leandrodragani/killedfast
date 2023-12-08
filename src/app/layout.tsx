import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, shadesOfPurple } from "@clerk/themes";
import { cn } from "@/lib/utils";
import { Header } from "@/components/nav";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#dc2627" },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased flex flex-col",
            fontSans.variable
          )}
        >
          <Header />
          {children}
          <Footer />
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
