import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/session-provider";
import { MainHeader } from "@/components/main-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "College Rental Platform",
  description: "Rent and lend items within your college community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f1f3f6] text-[#212121]`}
      >
        <AuthSessionProvider>
          <div className="flex min-h-screen flex-col">
            <MainHeader />
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-4">
              {children}
            </main>
            <footer className="bg-[#172337] py-8 text-white">
              <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">About</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:underline">Contact Us</a></li>
                      <li><a href="#" className="hover:underline">About Us</a></li>
                      <li><a href="#" className="hover:underline">Careers</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">Help</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:underline">Payments</a></li>
                      <li><a href="#" className="hover:underline">Shipping</a></li>
                      <li><a href="#" className="hover:underline">FAQ</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">Policy</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:underline">Return Policy</a></li>
                      <li><a href="#" className="hover:underline">Terms Of Use</a></li>
                      <li><a href="#" className="hover:underline">Security</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">Social</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:underline">Facebook</a></li>
                      <li><a href="#" className="hover:underline">Twitter</a></li>
                      <li><a href="#" className="hover:underline">Instagram</a></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-400">
                  &copy; {new Date().getFullYear()} College Rental Platform. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
