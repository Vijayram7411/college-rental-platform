"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { DefaultSession } from "next-auth";

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
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

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-[#1c5bbf] text-white"
          : "text-white hover:bg-[#1c5bbf]"
      }`}
    >
      {label}
    </Link>
  );
}

export function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user as (DefaultSession["user"] & { role?: string }) | undefined;
  const role = user?.role;

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/catalog" label="Catalog" />
            <NavLink href="/cart" label="Cart" />
            {session && <NavLink href="/me/borrowed" label="Borrowed" />}
            {session && <NavLink href="/me/profile" label="Profile" />}
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
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center gap-4">
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#2874f0] border-t border-[#1c5bbf]">
          <nav className="py-2">
            <MobileNavLink href="/catalog" label="Catalog" onClick={closeMobileMenu} />
            <MobileNavLink href="/cart" label="Cart" onClick={closeMobileMenu} />
            {session && <MobileNavLink href="/me/borrowed" label="Borrowed" onClick={closeMobileMenu} />}
            {session && <MobileNavLink href="/me/profile" label="Profile" onClick={closeMobileMenu} />}
            {(role === "OWNER" || role === "ADMIN") && (
              <>
                <MobileNavLink href="/owner/products" label="My Products" onClick={closeMobileMenu} />
                <MobileNavLink href="/owner/orders" label="Seller Orders" onClick={closeMobileMenu} />
              </>
            )}
            {role === "ADMIN" && (
              <MobileNavLink href="/admin/owners" label="Admin" onClick={closeMobileMenu} />
            )}
          </nav>
          
          {/* Mobile User Section */}
          <div className="border-t border-[#1c5bbf] py-3 px-4">
            {status !== "loading" && !session && (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="block w-full rounded-sm bg-white px-4 py-2 text-center text-sm font-medium text-[#2874f0] hover:bg-gray-100"
              >
                Login
              </Link>
            )}
            {session && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-bold text-[#2874f0]">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {user?.name ?? user?.email ?? "User"}
                    </span>
                    {role && (
                      <span className="text-xs text-[#ffe500]">
                        {role}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full rounded-sm border border-white px-4 py-2 text-sm font-medium text-white hover:bg-[#1c5bbf]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
