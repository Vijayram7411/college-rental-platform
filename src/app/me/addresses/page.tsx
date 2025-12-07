"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Address {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/me/addresses");
        if (res.status === 401) {
          router.push("/login?callbackUrl=/me/addresses");
          return;
        }
        const data = await res.json();
        setAddresses(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/me/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to add address");
        return;
      }
      const created = await res.json();
      setAddresses((prev) => [created, ...prev]);
      setForm({ line1: "", line2: "", city: "", state: "", postalCode: "", country: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to add address");
    }
  }

  async function setDefault(id: string) {
    setError(null);
    try {
      const res = await fetch("/api/me/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === updated.id })),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function remove(id: string) {
    setError(null);
    try {
      const res = await fetch("/api/me/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) return;
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Addresses</h1>
      <form
        onSubmit={handleCreate}
        className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm"
      >
        <p className="text-sm font-medium text-zinc-900">Add new address</p>
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
          className="flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800"
        >
          Add address
        </button>
      </form>
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-900">Saved addresses</h2>
        {loading ? (
          <p className="text-sm text-zinc-600">Loading...</p>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-zinc-600">You have no saved addresses.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {a.city}, {a.state} {a.postalCode}, {a.country}
                  </p>
                  {a.isDefault && (
                    <p className="mt-1 inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                      Default
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefault(a.id)}
                      className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
                    >
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
