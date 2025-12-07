"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { DefaultSession } from "next-auth";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "text-[#2874f0] border-b-2 border-[#2874f0]"
          : "text-white hover:text-[#ffe500]"
      }`}
    >
      {label}
    </Link>
  );
}

export function MainHeader() {
  const { data: session, status } = useSession();
  const user = session?.user as (DefaultSession["user"] & { role?: string }) | undefined;
  const role = user?.role;

  return (
    <header className="sticky top-0 z-30 bg-[#2874f0] shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold italic text-white">College Rentals</span>
              <span className="text-[10px] text-[#ffe500]">Explore <span className="font-semibold">Plus</span> ⭐</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/catalog" label="Catalog" />
            <NavLink href="/cart" label="Cart" />
            <NavLink href="/me/orders" label="Orders" />
            {(role === "OWNER" || role === "ADMIN") && (
              <>
                <NavLink href="/owner/products" label="My Products" />
                <NavLink href="/owner/orders" label="Seller Orders" />
              </>
            )}
            {role === "ADMIN" && (
              <NavLink href="/admin/owners" label="Admin" />
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {status === "loading" && (
            <span className="text-sm text-white">Loading...</span>
          )}
          {status !== "loading" && !session && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-sm bg-white px-8 py-1.5 text-sm font-medium text-[#2874f0] hover:bg-gray-100"
              >
                Login
              </Link>
            </div>
          )}
          {session && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#2874f0]">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {user?.name ?? user?.email ?? "User"}
                  </span>
                  {role && (
                    <span className="text-[10px] text-[#ffe500]">
                      {role}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-sm border border-white px-4 py-1.5 text-sm font-medium text-white hover:bg-[#1c5bbf]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
