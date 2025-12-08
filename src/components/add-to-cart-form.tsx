"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AddToCartForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [durationMonths, setDurationMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, durationMonths }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to add item");
        setLoading(false);
        return;
      }

      router.push("/cart");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flipkart-shadow space-y-4 rounded-sm bg-white p-4">
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            Duration (days)
          </label>
          <input
            type="number"
            min={1}
            value={durationMonths}
            onChange={(e) => setDurationMonths(Number(e.target.value) || 1)}
            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#ff9f00] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e68a00] disabled:opacity-60"
      >
        <span>📦</span>
        {loading ? "Processing..." : "BORROW"}
      </button>
    </form>
  );
}
