"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminAction {
  id: string;
  type: string;
  metadata: any;
  createdAt: string;
  admin: { name: string | null; email: string | null };
  targetUser: { name: string | null; email: string | null } | null;
}

export default function AdminActionsPage() {
  const router = useRouter();
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/actions");
        if (res.status === 401 || res.status === 403) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setActions(data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin actions");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Admin actions</h1>
      {loading ? (
        <p className="text-sm text-zinc-600">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : actions.length === 0 ? (
        <p className="text-sm text-zinc-600">No admin actions recorded.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {actions.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-zinc-200 bg-white p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-zinc-500">
                    {new Date(a.createdAt).toLocaleString()} · {a.type}
                  </p>
                  <p className="text-xs text-zinc-600">
                    Admin: {a.admin.name ?? a.admin.email}
                  </p>
                  {a.targetUser && (
                    <p className="text-xs text-zinc-600">
                      Target: {a.targetUser.name ?? a.targetUser.email}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
