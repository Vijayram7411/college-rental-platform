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
    <div className="campus-card-elevated flex flex-col overflow-hidden group cursor-pointer">
      {/* Image Section */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
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
            <span className="text-xs text-neutral-500">No image available</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-800 group-hover:text-brand-orange-600 transition-colors duration-200">
          {product.title}
        </h3>
        
        {/* Category and Status */}
        <div className="flex items-center gap-2">
          <span className="campus-badge-info">
            {product.category?.name ?? "Other"}
          </span>
          {!product.isActive && (
            <span className="campus-badge-error">
              Inactive
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-neutral-900">
            ₹{product.basePricePerMonth}
          </span>
          <span className="text-xs text-neutral-500 font-medium">/day</span>
        </div>

        {/* Discount */}
        {product.originalPricePerMonth &&
          product.originalPricePerMonth > product.basePricePerMonth && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.originalPricePerMonth}
              </span>
              <span className="campus-badge-success">
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
