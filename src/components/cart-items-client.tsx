"use client";

import { useState } from "react";

type CartItemWithProduct = {
  id: string;
  quantity: number;
  durationMonths: number;
  pricePerMonth: number;
  originalPricePerMonth: number | null;
  product: {
    id: string;
    title: string;
  };
};

export function CartItemsClient({ items: initialItems }: { items: CartItemWithProduct[] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateItem(id: string, data: { quantity?: number; durationMonths?: number }) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, ...data }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteItem(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id }),
      });
      if (!res.ok) return;
      setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const total = item.quantity * item.durationMonths * item.pricePerMonth;
        const disabled = loadingId === item.id;
        return (
          <li
            key={item.id}
            className="flipkart-shadow flex flex-col gap-4 rounded-sm bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <p className="mb-1 text-base font-semibold text-[#212121]">{item.product.title}</p>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-[#212121]">₹{item.pricePerMonth}</span>
                <span>/month</span>
                <span>•</span>
                <span>{item.durationMonths} days</span>
                <span>•</span>
                <span>Qty: {item.quantity}</span>
              </div>
              <p className="text-lg font-bold text-[#212121]">Total: ₹{total}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-medium">Qty</span>
                <input
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                  disabled={disabled}
                  onBlur={(e) =>
                    updateItem(item.id, { quantity: Number(e.target.value) || item.quantity })
                  }
                  className="w-16 rounded-sm border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-medium">Months</span>
                <input
                  type="number"
                  min={1}
                  defaultValue={item.durationMonths}
                  disabled={disabled}
                  onBlur={(e) =>
                    updateItem(item.id, {
                      durationMonths: Number(e.target.value) || item.durationMonths,
                    })
                  }
                  className="w-20 rounded-sm border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                />
              </label>
              <button
                type="button"
                disabled={disabled}
                onClick={() => deleteItem(item.id)}
                className="rounded-sm bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                REMOVE
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
