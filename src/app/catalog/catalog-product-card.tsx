"use client";

import { useState } from "react";
import Link from "next/link";

type CatalogProductCardProps = {
  product: {
    id: string;
    title: string;
    images: string;
    thumbnailUrl: string;
    basePricePerMonth: number;
    rating: number | null;
    ratingCount: number | null;
    category: { name: string } | null;
  };
};

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Parse images safely
  let images: string[] = [];
  try {
    images = product.images ? JSON.parse(product.images) : [];
  } catch (e) {
    console.error("Error parsing images for product", product.id);
  }
  const thumbnail = product.thumbnailUrl || images[0] || "";
  const hasValidImage = thumbnail && !imageError;

  return (
    <Link
      href={`/products/${product.id}`}
      className="flipkart-shadow-hover group flex flex-col overflow-hidden rounded-sm bg-white transition-all"
    >
      {/* Image */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200">
        {hasValidImage ? (
          <img
            src={thumbnail}
            alt={product.title}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2 p-3">
        <h2 className="line-clamp-2 text-sm font-semibold text-[#212121] group-hover:text-[#2874f0]">
          {product.title}
        </h2>
        <p className="text-xs text-gray-600">
          {product.category?.name ?? "Uncategorized"}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#212121]">
            ₹{product.basePricePerMonth}
          </span>
          <span className="text-xs text-gray-600">/month</span>
        </div>
        {product.rating !== null &&
          product.ratingCount !== null &&
          product.ratingCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="rounded-sm bg-[#388e3c] px-1.5 py-0.5 text-xs font-semibold text-white">
                {product.rating.toFixed(1)} ★
              </span>
              <span className="text-xs text-gray-500">
                ({product.ratingCount})
              </span>
            </div>
          )}
      </div>
    </Link>
  );
}
