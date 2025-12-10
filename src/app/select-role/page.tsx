"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SelectRolePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRoleSelection(role: "BORROWER" | "LENDER") {
    setLoading(true);
    setError(null);

    try {
      // Update the role in database
      const res = await fetch("/api/user/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to set role");
      }

      // Redirect based on role selection
      const targetUrl = role === "LENDER" ? "/owner/products" : "/catalog";
      window.location.href = targetUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-orange to-brand-orange-dark px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Welcome, {session?.user?.name}! 👋
          </h1>
          <p className="text-lg text-white/90">
            Choose how you want to use the platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* BORROW Option */}
          <button
            onClick={() => handleRoleSelection("BORROWER")}
            disabled={loading}
            className="group relative overflow-hidden rounded-lg bg-white p-8 shadow-xl transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-60"
          >
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[#ff9f00]/10 transition-transform group-hover:scale-150"></div>
            
            <div className="relative">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff9f00]/10 text-4xl">
                🛒
              </div>
              
              <h2 className="mb-3 text-2xl font-bold text-[#212121]">
                BORROW
              </h2>
              
              <p className="mb-4 text-gray-600">
                Rent items from other students in your college
              </p>
              
              <ul className="space-y-2 text-left text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Browse available products
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Rent items at affordable prices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Save money on purchases
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Rate and review products
                </li>
              </ul>
              
              <div className="mt-6 rounded-lg bg-[#ff9f00]/10 p-3 text-center">
                <span className="text-sm font-semibold text-[#ff9f00]">
                  Perfect for students who need items temporarily
                </span>
              </div>
            </div>
          </button>

          {/* LEND Option */}
          <button
            onClick={() => handleRoleSelection("LENDER")}
            disabled={loading}
            className="group relative overflow-hidden rounded-lg bg-white p-8 shadow-xl transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-60"
          >
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-brand-orange/10 transition-transform group-hover:scale-150">
            
            <div className="relative">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10 text-4xl">
                💼
              </div>
              
              <h2 className="mb-3 text-2xl font-bold text-[#212121]">
                LEND
              </h2>
              
              <p className="mb-4 text-gray-600">
                List your items and earn money by renting them out
              </p>
              
              <ul className="space-y-2 text-left text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  List unlimited products
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Earn passive income
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Manage your listings easily
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Track orders and earnings
                </li>
              </ul>
              
              <div className="mt-6 rounded-lg bg-brand-orange/10 p-3 text-center">
                <span className="text-sm font-semibold text-brand-orange">
                  Perfect for students with items to share
                </span>
              </div>
            </div>
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-500 p-4 text-center text-white">
            {error}
          </div>
        )}

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-white/80">
            💡 You&apos;ll see this choice every time you visit the home page
          </p>
          <p className="text-xs text-white/60">
            Choose your mode for this session - you can always come back and switch
          </p>
        </div>
      </div>
    </div>
  );
}
