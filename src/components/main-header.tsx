"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as (DefaultSession["user"] & { role?: string }) | undefined;
  const role = user?.role;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Only trigger if not typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Show shortcuts help with ?
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      // Close shortcuts modal with Escape
      if (e.key === "Escape") {
        setShowShortcuts(false);
        setMobileMenuOpen(false);
        return;
      }

      // Navigation shortcuts (Alt + key)
      if (e.altKey) {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
          case "c":
            router.push("/catalog");
            break;
          case "k":
            router.push("/cart");
            break;
          case "b":
            if (session) router.push("/me/borrowed");
            break;
          case "p":
            if (session) router.push("/me/profile");
            break;
          case "m":
            if (role === "OWNER" || role === "ADMIN") router.push("/owner/products");
            break;
          case "h":
            router.push("/");
            break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, session, role]);

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

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#212121]">
                ⌨️ Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Show this help</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Shift + ?</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Go to Catalog</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Alt + C</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Go to Cart</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Alt + K</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Go to Borrowed</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Alt + B</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Go to Profile</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Alt + P</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Go to My Products</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Alt + M</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Go to Home</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Alt + H</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Close modal/menu</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Esc</kbd>
              </div>
            </div>

            <div className="mt-6 rounded-sm bg-blue-50 p-3 text-xs text-gray-700">
              <p className="font-semibold mb-1">💡 Tip:</p>
              <p>Press <kbd className="rounded bg-white px-1 py-0.5 font-mono">Shift + ?</kbd> anytime to see these shortcuts!</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
