"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OwnerProductDetailClientProps = {
  product: {
    id: string;
    title: string;
    description: string;
    images: string;
    thumbnailUrl: string;
    basePricePerMonth: number;
    originalPricePerMonth: number | null;
    rating: number | null;
    ratingCount: number | null;
    isActive: boolean;
    category: { name: string } | null;
    owner: { name: string | null; email: string | null };
    reviews: Array<{
      id: string;
      rating: number;
      comment: string | null;
      user: {
        name: string | null;
        email: string | null;
      };
    }>;
  };
};

export function OwnerProductDetailClient({
  product,
}: OwnerProductDetailClientProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse images safely
  let images: string[] = [];
  try {
    images = product.images ? JSON.parse(product.images) : [];
  } catch (_e) {
    console.error("Error parsing images for product", product.id);
  }

  const thumbnail = product.thumbnailUrl || images[0] || "";
  const hasValidImage = thumbnail && !imageError;
  const currentImage = images[currentImageIndex] || thumbnail;

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/owner/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to delete product");
        setDeleting(false);
        return;
      }

      // Redirect to products list
      router.push("/owner/products");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Back Button */}
      <div className="mb-4">
        <Link
          href="/owner/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2874f0] hover:underline"
        >
          ← Back to My Products
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-5">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {product.title}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {product.category?.name && (
                <span>{product.category.name} · </span>
              )}
              {product.isActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-600">Inactive</span>
              )}
            </p>
          </div>

          {/* Main Image */}
          <div className="aspect-video w-full overflow-hidden rounded-sm bg-gradient-to-br from-gray-100 to-gray-200 flipkart-shadow">
            {hasValidImage ? (
              <img
                src={currentImage}
                alt={product.title}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <span className="text-8xl">📦</span>
                <span className="text-sm text-gray-500">
                  No image available
                </span>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && !imageError && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-[#2874f0]"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="flipkart-shadow rounded-sm bg-white p-4">
            <h2 className="mb-2 text-lg font-bold text-[#212121]">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {product.description}
            </p>
          </div>

          {/* Price Details */}
          <div className="flipkart-shadow space-y-3 rounded-sm bg-white p-4">
            <h2 className="text-lg font-bold text-[#212121]">Price Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#212121]">
                  ₹{product.basePricePerMonth}
                </span>
                <span className="text-gray-600">/day</span>
              </div>
              {product.originalPricePerMonth &&
                product.originalPricePerMonth > product.basePricePerMonth && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPricePerMonth}
                    </span>
                    <span className="rounded-sm bg-[#388e3c] px-2 py-0.5 text-xs font-semibold text-white">
                      {Math.round(
                        ((product.originalPricePerMonth -
                          product.basePricePerMonth) /
                          product.originalPricePerMonth) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                )}
              {product.rating !== null &&
                product.ratingCount !== null &&
                product.ratingCount > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="rounded-sm bg-[#388e3c] px-2 py-1 text-sm font-semibold text-white">
                      {product.rating.toFixed(1)} ★
                    </span>
                    <span className="text-sm text-gray-600">
                      {product.ratingCount} ratings
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Reviews */}
          <div className="flipkart-shadow rounded-sm bg-white p-4">
            <h2 className="mb-3 text-lg font-bold text-[#212121]">
              Reviews & Ratings
            </h2>
            {product.reviews.length === 0 ? (
              <p className="text-sm text-gray-600">No reviews yet.</p>
            ) : (
              <ul className="space-y-3">
                {product.reviews.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-sm border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#212121]">
                        {r.user.name ?? r.user.email ?? "User"}
                      </span>
                      <span className="rounded-sm bg-[#388e3c] px-2 py-0.5 text-xs font-semibold text-white">
                        {r.rating} ★
                      </span>
                    </div>
                    {r.comment && (
                      <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar - Action Buttons */}
        <div className="space-y-4">
          <div className="flipkart-shadow sticky top-4 space-y-3 rounded-sm bg-white p-4">
            <h3 className="text-lg font-bold text-[#212121]">
              Product Actions
            </h3>

            {/* Edit Button */}
            <Link
              href={`/owner/products/${product.id}/edit`}
              className="block w-full rounded-sm bg-[#2874f0] px-4 py-3 text-center text-sm font-bold text-white hover:bg-[#1c5bbf]"
            >
              ✏️ Edit Product
            </Link>

            {/* Delete Button */}
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="w-full rounded-sm bg-red-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              🗑️ Delete Product
            </button>

            {/* View Public Page */}
            <Link
              href={`/products/${product.id}`}
              target="_blank"
              className="block w-full rounded-sm border-2 border-gray-300 px-4 py-3 text-center text-sm font-bold text-[#212121] hover:border-[#2874f0]"
            >
              👁️ View Public Page
            </Link>

            {error && (
              <div className="rounded-sm bg-red-50 p-3 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Product Stats */}
            <div className="mt-4 space-y-2 border-t pt-4">
              <h4 className="text-sm font-semibold text-[#212121]">
                Product Stats
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={
                      product.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reviews:</span>
                  <span>{product.reviews.length}</span>
                </div>
                {product.rating !== null && (
                  <div className="flex justify-between">
                    <span>Average Rating:</span>
                    <span>{product.rating.toFixed(1)} ★</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-sm bg-white p-6 shadow-xl">
            <div className="mb-4 text-center text-4xl">⚠️</div>
            <h3 className="mb-2 text-center text-lg font-bold text-[#212121]">
              Delete Product?
            </h3>
            <p className="mb-4 text-center text-sm text-gray-600">
              Are you sure you want to delete <strong>{product.title}</strong>?
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
