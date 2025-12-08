"use client";

import { useState } from "react";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  items: {
    id: string;
    quantity: number;
    durationMonths: number;
    product: {
      id: string;
      title: string;
    };
  }[];
  shipping: {
    line1: string;
    city: string;
    state: string;
  } | null;
}

export function OwnerOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
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

  async function handleMarkAsCompleted(orderId: string) {
    if (!confirm("Mark this order as completed? This means the item has been returned.")) {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update order");
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: "COMPLETED" }
          : order
      ));

      alert("Order marked as completed!");
    } catch (err: any) {
      alert(err.message || "Failed to update order");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#212121]">Orders for Your Products</h1>
      <p className="text-sm text-gray-600">Manage rental orders for your items</p>

      {orders.length === 0 ? (
        <div className="flipkart-shadow rounded-sm bg-white p-8 text-center">
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="mb-2 text-lg font-semibold text-[#212121]">
            No orders yet
          </h3>
          <p className="text-sm text-gray-600">
            Orders for your products will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flipkart-shadow rounded-sm bg-white overflow-hidden"
            >
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
                    <p className="text-sm font-medium text-[#212121] mt-1">
                      Renter: {order.user.name ?? order.user.email}
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
                <h3 className="text-sm font-semibold text-[#212121] mb-3">
                  Items in this order:
                </h3>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {item.product.title} · {item.quantity} pcs · {item.durationMonths} day{item.durationMonths > 1 ? "s" : ""}
                      </span>
                    </li>
                  ))}
                </ul>

                {order.shipping && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">📍 Pick up point:</span>{" "}
                      {order.shipping.line1}, {order.shipping.city}, {order.shipping.state}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {order.status === "ACTIVE" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleMarkAsCompleted(order.id)}
                      disabled={updatingOrderId === order.id}
                      className="rounded-sm bg-[#388e3c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d6e2d] disabled:opacity-60"
                    >
                      {updatingOrderId === order.id
                        ? "Updating..."
                        : "✓ Mark as Returned"}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Click this button when the borrower has returned the item
                    </p>
                  </div>
                )}

                {order.status === "COMPLETED" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Item returned successfully</span>
                    </div>
                  </div>
                )}

                {order.status === "CANCELLED" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Order cancelled</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
