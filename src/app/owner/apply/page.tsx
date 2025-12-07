"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", collegeName: "", documentUrl: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/owner/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/owner/apply");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to submit application");
      } else {
        setMessage("Application submitted. An admin will review it soon.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Owner application</h1>
      <p className="text-sm text-zinc-600">
        Share your contact and verification details so admins can approve you as
        an item owner.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-800">Phone</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-800">College name</label>
          <input
            type="text"
            required
            value={form.collegeName}
            onChange={(e) => updateField("collegeName", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-zinc-800">Document URL</label>
          <input
            type="url"
            required
            placeholder="Link to your ID/verification document"
            value={form.documentUrl}
            onChange={(e) => updateField("documentUrl", e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit application"}
        </button>
      </form>
    </div>
  );
}
