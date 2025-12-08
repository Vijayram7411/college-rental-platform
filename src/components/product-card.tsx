"use client";

import { useState } from "react";

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    images: string;
    thumbnailUrl: string;
    basePricePerMonth: number;
    originalPricePerMonth: number | null;
    isActive: boolean;
    category: { name: string } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Parse images safely
  let images: string[] = [];
  try {
    images = product.images ? JSON.parse(product.images) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
    images = [];
  }
  
  const thumbnail = product.thumbnailUrl || images[0] || "";
  const hasValidImage = thumbnail && !imageError;

  return (
    <div className="flipkart-shadow-hover flex flex-col overflow-hidden rounded-sm bg-white transition-all">
      {/* Image Section */}
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
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-6xl">📦</span>
            <span className="text-xs text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-[#212121]">
          {product.title}
        </h3>
        
        {/* Category and Status */}
        <div className="flex items-center gap-2">
          <span className="rounded-sm bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            {product.category?.name ?? "Other"}
          </span>
          {!product.isActive && (
            <span className="rounded-sm bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
              Inactive
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#212121]">
            ₹{product.basePricePerMonth}
          </span>
          <span className="text-xs text-gray-600">/day</span>
        </div>

        {/* Discount */}
        {product.originalPricePerMonth &&
          product.originalPricePerMonth > product.basePricePerMonth && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPricePerMonth}
              </span>
              <span className="rounded-sm bg-[#388e3c] px-2 py-0.5 text-xs font-semibold text-white">
                {Math.round(
                  ((product.originalPricePerMonth - product.basePricePerMonth) /
                    product.originalPricePerMonth) *
                    100
                )}
                % OFF
              </span>
            </div>
          )}

        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-2 text-xs text-gray-500">
            <summary className="cursor-pointer">Debug Info</summary>
            <div className="mt-1 space-y-1">
              <p>Thumbnail: {thumbnail || "None"}</p>
              <p>Images count: {images.length}</p>
              <p>Image error: {imageError ? "Yes" : "No"}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
