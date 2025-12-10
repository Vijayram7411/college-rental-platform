"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2 animate-fade-in" suppressHydrationWarning>
          {/* LENDER actions */}
          {role === "LENDER" && (
            <Link
              href="/owner/products/add"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
            >
              <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                List Item
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-500 text-white group-hover:bg-warning-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </Link>
          )}
          
          {/* Common for both */}
          {(role === "BORROWER" || role === "LENDER") && (
            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
            >
              <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                Browse Catalog
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange-500 text-white group-hover:bg-brand-orange-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </Link>
          )}

          {/* BORROWER actions */}
          {role === "BORROWER" && (
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
            >
              <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                View Cart
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-500 text-white group-hover:bg-success-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:shadow-xl ${
          isOpen
            ? "bg-neutral-700 rotate-45"
            : "bg-brand-orange-500 hover:bg-brand-orange-600"
        }`}
        aria-label="Quick actions"
        suppressHydrationWarning
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
