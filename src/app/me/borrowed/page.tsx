"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BorrowedItem {
  id: string;
  status: string;
  totalAmount: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    durationMonths: number;
    pricePerMonth: number;
    product: {
      id: string;
      title: string;
      thumbnailUrl: string;
      owner: {
        id: string;
        name: string | null;
        email: string | null;
      };
      category: {
        name: string;
      };
    };
  }[];
}

export default function BorrowedPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<BorrowedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [reviewingProduct, setReviewingProduct] = useState<{
    orderId: string;
    productId: string;
    productTitle: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    fetchBorrowedItems();
  }, []);

  async function fetchBorrowedItems() {
    try {
      const res = await fetch("/api/me/borrowed");

      if (res.status === 401) {
        router.push("/login?callbackUrl=/me/borrowed");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch borrowed items");
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to load borrowed items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ");
  };

  async function handleCancelOrder(orderId: string) {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel order");
      }

      // Refresh orders
      await fetchBorrowedItems();
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleSubmitReview() {
    if (!reviewingProduct) return;

    try {
      const res = await fetch(`/api/reviews/${reviewingProduct.orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: reviewingProduct.productId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      alert("Review submitted successfully!");
      setReviewingProduct(null);
      setReviewRating(5);
      setReviewComment("");
      await fetchBorrowedItems();
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#212121]">Borrowed Items</h1>
        <p className="text-gray-600 mt-2">View all items you have rented</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No borrowed items yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start browsing the catalog to rent items from your college
          </p>
          <Link
            href="/catalog"
            className="inline-block bg-[#2874f0] text-white px-6 py-2 rounded-sm font-medium hover:bg-[#1c5bbf]"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Order ID: {order.id.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {formatStatus(order.status)}
                    </span>
                    <p className="text-lg font-bold text-[#212121] mt-2">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <Link href={`/products/${item.product.id}`}>
                        <img
                          src={item.product.thumbnailUrl}
                          alt={item.product.title}
                          className="h-24 w-24 rounded-lg object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="text-lg font-medium text-[#212121] hover:text-[#2874f0]"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Category: {item.product.category.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Owner: {item.product.owner.name || item.product.owner.email}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-sm text-gray-600">
                            Duration: {item.durationMonths} day{item.durationMonths > 1 ? "s" : ""}
                          </span>
                          <span className="text-sm font-medium text-[#212121]">
                            ₹{item.pricePerMonth}/day
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {order.startDate && order.endDate && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Start Date:</span>{" "}
                        {new Date(order.startDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span>{" "}
                        {new Date(order.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={updatingOrderId === order.id}
                      className="rounded-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {updatingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}

                {/* Review Button for Completed Orders */}
                {order.status === "COMPLETED" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-[#212121] mb-3">
                      Rate your experience:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() =>
                            setReviewingProduct({
                              orderId: order.id,
                              productId: item.product.id,
                              productTitle: item.product.title,
                            })
                          }
                          className="rounded-sm bg-[#ff9f00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00]"
                        >
                          ⭐ Review {item.product.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-[#212121]">
              Review: {reviewingProduct.productTitle}
            </h3>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-[#212121]">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-3xl transition-all hover:scale-110"
                  >
                    {star <= reviewRating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {reviewRating === 1 && "Poor"}
                {reviewRating === 2 && "Fair"}
                {reviewRating === 3 && "Good"}
                {reviewRating === 4 && "Very Good"}
                {reviewRating === 5 && "Excellent"}
              </p>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-[#212121]">
                Comment (optional)
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setReviewingProduct(null);
                  setReviewRating(5);
                  setReviewComment("");
                }}
                className="flex-1 rounded-sm border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-[#212121] hover:border-[#2874f0]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 rounded-sm bg-[#ff9f00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e68a00]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
