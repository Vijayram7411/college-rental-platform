import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SellerDashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Get seller statistics
  const productsCount = await prisma.product.count({
    where: { ownerId: userId },
  });
  
  const activeProductsCount = await prisma.product.count({
    where: { ownerId: userId, isActive: true },
  });

  // For now, set orders and earnings to 0 (will be calculated from actual orders later)
  const ordersCount = 0;
  const earnings = 0;

  // Calculate additional metrics
  const inactiveProductsCount = productsCount - activeProductsCount;
  const averageEarningsPerOrder = ordersCount > 0 ? earnings / ordersCount : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flipkart-shadow rounded-lg bg-gradient-to-r from-[#2874f0] to-[#1c5bbf] p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">💼 Seller Dashboard</h1>
            <p className="text-white/90">Welcome back! Here&apos;s your business overview</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-white/70 mb-1">Last updated</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flipkart-shadow-hover rounded-lg bg-white p-6 transition-all hover:scale-105">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-3xl">
            📦
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-[#212121] mb-1">{productsCount}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 font-semibold">{activeProductsCount} active</span>
            {inactiveProductsCount > 0 && (
              <span className="text-gray-400">• {inactiveProductsCount} inactive</span>
            )}
          </div>
        </div>

        <div className="flipkart-shadow-hover rounded-lg bg-white p-6 transition-all hover:scale-105">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 text-3xl">
            ✅
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Active Listings</h3>
          <p className="text-4xl font-bold text-green-600 mb-1">{activeProductsCount}</p>
          <p className="text-xs text-gray-500">
            {productsCount > 0 ? Math.round((activeProductsCount / productsCount) * 100) : 0}% of total
          </p>
        </div>

        <div className="flipkart-shadow-hover rounded-lg bg-white p-6 transition-all hover:scale-105">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-3xl">
            📋
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Orders</h3>
          <p className="text-4xl font-bold text-orange-600 mb-1">{ordersCount}</p>
          <p className="text-xs text-gray-500">
            {ordersCount > 0 ? "Rental requests received" : "No orders yet"}
          </p>
        </div>

        <div className="flipkart-shadow-hover rounded-lg bg-white p-6 transition-all hover:scale-105">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-3xl">
            💰
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Earnings</h3>
          <p className="text-4xl font-bold text-purple-600 mb-1">₹{earnings.toFixed(0)}</p>
          <p className="text-xs text-gray-500">
            {ordersCount > 0 ? `₹${averageEarningsPerOrder.toFixed(0)} avg per order` : "Start earning today"}
          </p>
        </div>
      </div>

      {/* Performance Insights */}
      {productsCount > 0 && (
        <div className="flipkart-shadow rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6">
          <h2 className="text-xl font-bold text-[#212121] mb-4 flex items-center gap-2">
            📊 Performance Insights
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Listing Rate</span>
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-2xl font-bold text-[#2874f0]">
                {productsCount > 0 ? Math.round((activeProductsCount / productsCount) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Products currently active</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Order Rate</span>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {activeProductsCount > 0 ? (ordersCount / activeProductsCount).toFixed(1) : "0.0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Orders per active product</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Revenue/Product</span>
                <span className="text-2xl">💵</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                ₹{productsCount > 0 ? (earnings / productsCount).toFixed(0) : "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Average per product</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flipkart-shadow rounded-lg bg-white p-6">
        <h2 className="text-xl font-bold text-[#212121] mb-4 flex items-center gap-2">
          ⚡ Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/owner/products/add"
            className="group flex items-center gap-4 rounded-lg border-2 border-gray-200 p-5 transition-all hover:border-[#2874f0] hover:bg-blue-50 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2874f0] to-[#1c5bbf] text-2xl text-white shadow-md group-hover:scale-110 transition-transform">
              ➕
            </div>
            <div>
              <h3 className="font-bold text-[#212121] group-hover:text-[#2874f0] transition-colors">Add New Product</h3>
              <p className="text-xs text-gray-600">List a new item for rent</p>
            </div>
          </Link>

          <Link
            href="/owner/products"
            className="group flex items-center gap-4 rounded-lg border-2 border-gray-200 p-5 transition-all hover:border-green-500 hover:bg-green-50 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-2xl text-white shadow-md group-hover:scale-110 transition-transform">
              📦
            </div>
            <div>
              <h3 className="font-bold text-[#212121] group-hover:text-green-600 transition-colors">My Products</h3>
              <p className="text-xs text-gray-600">View and manage listings</p>
            </div>
          </Link>

          <Link
            href="/owner/orders"
            className="group flex items-center gap-4 rounded-lg border-2 border-gray-200 p-5 transition-all hover:border-orange-500 hover:bg-orange-50 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-2xl text-white shadow-md group-hover:scale-110 transition-transform">
              📋
            </div>
            <div>
              <h3 className="font-bold text-[#212121] group-hover:text-orange-600 transition-colors">My Orders</h3>
              <p className="text-xs text-gray-600">Track rental requests</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Tips & Best Practices */}
      {productsCount > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flipkart-shadow rounded-lg bg-white p-6">
            <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
              💡 Tips to Increase Earnings
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold flex-shrink-0">✓</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Add clear photos</p>
                  <p className="text-xs text-gray-600">Products with 3+ photos get 2x more rentals</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold flex-shrink-0">✓</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Write detailed descriptions</p>
                  <p className="text-xs text-gray-600">Include condition, features, and usage tips</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold flex-shrink-0">✓</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Price competitively</p>
                  <p className="text-xs text-gray-600">Check similar items in your college catalog</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold flex-shrink-0">✓</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Respond quickly</p>
                  <p className="text-xs text-gray-600">Fast responses lead to more confirmed rentals</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flipkart-shadow rounded-lg bg-white p-6">
            <h3 className="text-lg font-bold text-[#212121] mb-4 flex items-center gap-2">
              🎯 Your Goals
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Active Products</span>
                  <span className="text-sm font-bold text-[#2874f0]">{activeProductsCount}/10</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2874f0] to-[#1c5bbf] rounded-full transition-all"
                    style={{ width: `${Math.min((activeProductsCount / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Goal: List 10 active products</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Total Orders</span>
                  <span className="text-sm font-bold text-green-600">{ordersCount}/20</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                    style={{ width: `${Math.min((ordersCount / 20) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Goal: Receive 20 rental orders</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Earnings</span>
                  <span className="text-sm font-bold text-purple-600">₹{earnings.toFixed(0)}/₹5000</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                    style={{ width: `${Math.min((earnings / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Goal: Earn ₹5000 in total</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started Guide */}
      {productsCount === 0 && (
        <div className="flipkart-shadow rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-8">
          <div className="mb-4 text-5xl">🚀</div>
          <h2 className="text-2xl font-bold text-[#212121] mb-3">Get Started as a Lender</h2>
          <p className="text-gray-700 mb-6">
            Start earning by listing your items for rent. It&apos;s easy and free!
          </p>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2874f0] text-xs font-bold text-white">1</span>
              <div>
                <h4 className="font-semibold text-[#212121]">Add Your First Product</h4>
                <p className="text-sm text-gray-600">Upload photos and set your rental price</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2874f0] text-xs font-bold text-white">2</span>
              <div>
                <h4 className="font-semibold text-[#212121]">Wait for Rental Requests</h4>
                <p className="text-sm text-gray-600">Students will browse and request your items</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2874f0] text-xs font-bold text-white">3</span>
              <div>
                <h4 className="font-semibold text-[#212121]">Approve & Earn</h4>
                <p className="text-sm text-gray-600">Approve requests and start earning money</p>
              </div>
            </li>
          </ol>
          <Link
            href="/owner/products/add"
            className="inline-block rounded-lg bg-[#2874f0] px-8 py-3 font-bold text-white shadow-md hover:bg-[#1c5bbf] transition-all"
          >
            List Your First Product
          </Link>
        </div>
      )}
    </div>
  );
}
