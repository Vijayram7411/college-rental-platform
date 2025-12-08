"use client";

import { useState } from "react";
import Link from "next/link";

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2 animate-fade-in">
          <Link
            href="/owner/products/add"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
          >
            <span className="text-sm font-medium text-[#212121] whitespace-nowrap">
              List Item
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff9f00] text-white group-hover:bg-[#e68a00]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </Link>
          
          <Link
            href="/catalog"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
          >
            <span className="text-sm font-medium text-[#212121] whitespace-nowrap">
              Browse Catalog
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2874f0] text-white group-hover:bg-[#1c5bbf]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </Link>

          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg hover:shadow-xl transition-all group"
          >
            <span className="text-sm font-medium text-[#212121] whitespace-nowrap">
              View Cart
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#388e3c] text-white group-hover:bg-[#2d6e2d]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </Link>
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:shadow-xl ${
          isOpen
            ? "bg-gray-700 rotate-45"
            : "bg-[#2874f0] hover:bg-[#1c5bbf]"
        }`}
        aria-label="Quick actions"
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
