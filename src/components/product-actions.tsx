"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductActionsProps {
  productId: string;
  productTitle: string;
  showEditButton?: boolean;
}

export function ProductActions({ productId, productTitle, showEditButton = true }: ProductActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/owner/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to delete product");
        setDeleting(false);
        return;
      }

      // Refresh the page to show updated product list
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setDeleting(false);
    }
  }

  return (
    <>
      {showEditButton ? (
        <div className="mt-2 flex gap-2">
          <Link
            href={`/owner/products/${productId}/edit`}
            className="flex-1 rounded-sm bg-[#2874f0] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#1c5bbf]"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="flex-1 rounded-sm bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#1c5bbf]"
          >
            🗑️ Delete
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="w-full rounded-sm bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 rounded-sm bg-red-50 p-2 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-xl">
            <div className="mb-4 text-center text-4xl">⚠️</div>
            <h3 className="mb-2 text-center text-lg font-bold text-[#212121]">
              Delete Product?
            </h3>
            <p className="mb-4 text-center text-sm text-gray-600">
              Are you sure you want to delete <strong>{productTitle}</strong>?
              This action cannot be undone.
            </p>
            
            {error && (
              <div className="mb-4 rounded-sm bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setError(null);
                }}
                disabled={deleting}
                className="flex-1 rounded-sm border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-[#212121] hover:border-[#2874f0] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-sm bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
