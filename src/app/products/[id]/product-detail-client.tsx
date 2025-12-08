"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartForm } from "@/components/add-to-cart-form";

type ProductDetailClientProps = {
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
    contactNumber: string | null;
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

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
      <div className="space-y-5">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">{product.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {product.category?.name && <span>{product.category.name} · </span>}
            Owned by {product.owner.name ?? product.owner.email ?? "Owner"}
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
              <span className="text-sm text-gray-500">No image available</span>
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
          <h2 className="mb-2 text-lg font-bold text-[#212121]">Description</h2>
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
          <p className="mt-3 text-xs text-gray-500">
            After renting this item you&apos;ll be able to leave a review from
            your orders page.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="flipkart-shadow sticky top-4 rounded-sm bg-white p-4">
          <AddToCartForm productId={product.id} />
          <Link
            href="/cart"
            className="mt-3 block rounded-sm border-2 border-gray-300 px-4 py-2 text-center text-sm font-bold text-[#212121] hover:border-[#2874f0]"
          >
            View Cart
          </Link>
        </div>

        {/* Contact Information */}
        {product.contactNumber && (
          <div className="flipkart-shadow rounded-sm bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-[#212121]">
              Contact Lender
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-sm bg-blue-50 p-3">
                <span className="text-2xl">📱</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Phone / WhatsApp</p>
                  <p className="text-sm font-bold text-[#212121]">
                    {product.contactNumber}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${product.contactNumber}`}
                className="block rounded-sm bg-[#388e3c] px-4 py-2 text-center text-sm font-bold text-white hover:bg-[#2d7a2e]"
              >
                📞 Call Now
              </a>
              <a
                href={`https://wa.me/91${product.contactNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-sm bg-[#25d366] px-4 py-2 text-center text-sm font-bold text-white hover:bg-[#1fb855]"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
