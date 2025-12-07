"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OwnerProfile {
  id: string;
  phone: string | null;
  collegeName: string | null;
  documentUrl: string | null;
  status: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function AdminOwnersPage() {
  const router = useRouter();
  const [owners, setOwners] = useState<OwnerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/owners");
      if (res.status === 401 || res.status === 403) {
        router.push("/");
        return;
      }
      const data = await res.json();
      setOwners(data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load owner applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function decide(id: string, action: "APPROVE" | "REJECT") {
    try {
      const res = await fetch("/api/admin/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerProfileId: id, action }),
      });
      if (!res.ok) return;
      setOwners((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Owner applications</h1>
      {loading ? (
        <p className="text-sm text-zinc-600">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : owners.length === 0 ? (
        <p className="text-sm text-zinc-600">No pending applications.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {owners.map((o) => (
            <li
              key={o.id}
              className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-zinc-900">
                  {o.user.name ?? o.user.email ?? "User"}
                </p>
                <p className="text-xs text-zinc-600">
                  Phone: {o.phone ?? "-"} · College: {o.collegeName ?? "-"}
                </p>
                {o.documentUrl && (
                  <a
                    href={o.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-900 underline-offset-2 hover:underline"
                  >
                    View document
                  </a>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => decide(o.id, "APPROVE")}
                  className="rounded-md border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => decide(o.id, "REJECT")}
                  className="rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
