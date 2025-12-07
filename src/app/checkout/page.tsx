"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: form }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Checkout failed");
        setLoading(false);
        return;
      }

      router.push("/me/orders");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Checkout</h1>
      <p className="text-sm text-zinc-600">
        Enter your shipping address to confirm your rental order.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-800">Address line 1</label>
          <input
            type="text"
            required
            value={form.line1}
            onChange={(e) => updateField("line1", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-800">Address line 2</label>
          <input
            type="text"
            value={form.line2}
            onChange={(e) => updateField("line2", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-800">City</label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-800">State</label>
            <input
              type="text"
              required
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[2fr,1fr]">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-800">Postal code</label>
            <input
              type="text"
              required
              value={form.postalCode}
              onChange={(e) => updateField("postalCode", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-800">Country</label>
            <input
              type="text"
              required
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
