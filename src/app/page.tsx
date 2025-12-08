import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Hero Banner */}
      <section className="flipkart-shadow overflow-hidden rounded-sm bg-white">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6 p-8 md:p-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#ffe500] px-3 py-1 text-xs font-bold text-[#212121]">
              <span>⚡</span>
              <span>CAMPUS EXCLUSIVE</span>
            </div>
            <h1 className="text-3xl font-bold text-[#212121] md:text-4xl">
              Rent & Lend with Your College Community
            </h1>
            <p className="text-base text-gray-600">
              Find affordable rentals for books, electronics, and dorm essentials. 
              List your items and earn from classmates. Simple, secure, student-friendly.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-sm bg-[#ff9f00] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e68a00]"
              >
                Browse Catalog
              </Link>
              <Link
                href="/owner/apply"
                className="inline-flex items-center gap-2 rounded-sm bg-[#2874f0] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#1c5bbf]"
              >
                List Your Items
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-gray-700">No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-gray-700">Student Budget Friendly</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#2874f0] to-[#1c5bbf] p-8 md:p-12">
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-4 text-6xl">🎓</div>
                <h3 className="mb-2 text-2xl font-bold">Join Thousands of Students</h3>
                <p className="text-sm opacity-90">Renting smarter, saving more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/cart" className="flipkart-shadow-hover group rounded-sm bg-white p-6 transition-all">
          <div className="mb-3 text-3xl">🛒</div>
          <h3 className="mb-1 font-semibold text-[#212121] group-hover:text-[#2874f0]">Your Cart</h3>
          <p className="text-xs text-gray-600">View items & checkout</p>
        </Link>
        <Link href="/me/orders" className="flipkart-shadow-hover group rounded-sm bg-white p-6 transition-all">
          <div className="mb-3 text-3xl">📦</div>
          <h3 className="mb-1 font-semibold text-[#212121] group-hover:text-[#2874f0]">My Orders</h3>
          <p className="text-xs text-gray-600">Track your rentals</p>
        </Link>
        <Link href="/me/addresses" className="flipkart-shadow-hover group rounded-sm bg-white p-6 transition-all">
          <div className="mb-3 text-3xl">📍</div>
          <h3 className="mb-1 font-semibold text-[#212121] group-hover:text-[#2874f0]">Addresses</h3>
          <p className="text-xs text-gray-600">Manage delivery locations</p>
        </Link>
        {role === "OWNER" || role === "ADMIN" ? (
          <Link href="/owner/products" className="flipkart-shadow-hover group rounded-sm bg-white p-6 transition-all">
            <div className="mb-3 text-3xl">💼</div>
            <h3 className="mb-1 font-semibold text-[#212121] group-hover:text-[#2874f0]">Seller Dashboard</h3>
            <p className="text-xs text-gray-600">Manage your products</p>
          </Link>
        ) : (
          <Link href="/owner/apply" className="flipkart-shadow-hover group rounded-sm bg-gradient-to-br from-[#ffe500] to-[#ffd700] p-6 transition-all">
            <div className="mb-3 text-3xl">⭐</div>
            <h3 className="mb-1 font-semibold text-[#212121]">Start Renting Out</h3>
            <p className="text-xs text-gray-800">Earn money from your items</p>
          </Link>
        )}
      </div>

      {/* Login Prompt */}
      {!session && (
        <section className="flipkart-shadow rounded-sm bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-[#212121]">New to College Rentals?</h2>
              <p className="text-sm text-gray-600">
                Create an account to start renting or list your items today
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="rounded-sm border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-[#2874f0] hover:border-[#2874f0]"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="flipkart-shadow rounded-sm bg-white p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-[#212121]">Why Choose Us?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-3 text-4xl">🔒</div>
            <h3 className="mb-2 font-semibold text-[#212121]">Secure Transactions</h3>
            <p className="text-sm text-gray-600">Safe payments and verified users for peace of mind</p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-4xl">💰</div>
            <h3 className="mb-2 font-semibold text-[#212121]">Best Prices</h3>
            <p className="text-sm text-gray-600">Affordable rentals that fit student budgets</p>
          </div>
          <div className="text-center">
            <div className="mb-3 text-4xl">🚀</div>
            <h3 className="mb-2 font-semibold text-[#212121]">Quick Delivery</h3>
            <p className="text-sm text-gray-600">Fast on-campus delivery and pickup options</p>
          </div>
        </div>
      </section>
    </div>
  );
}
