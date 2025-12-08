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
  } catch (_e) {
    console.error("Error parsing images for product", product.id);
  }
  const thumbnail = product.thumbnailUrl || images[0] || "";
  const hasValidImage = thumbnail && !imageError;

  return (
    <Link
      href={`/products/${product.id}`}
      className="flipkart-shadow-hover group flex flex-col overflow-hidden rounded-lg bg-white transition-all hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {hasValidImage ? (
          <img
            src={thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-[#2874f0] shadow-md">
            {product.category?.name ?? "Other"}
          </span>
        </div>

        {/* Rating Badge */}
        {product.rating !== null &&
          product.ratingCount !== null &&
          product.ratingCount > 0 && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-[#388e3c] px-2.5 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
                {product.rating.toFixed(1)} ★
              </span>
            </div>
          )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-3 p-4">
        <h2 className="line-clamp-2 text-base font-bold text-[#212121] group-hover:text-[#2874f0] transition-colors min-h-[3rem]">
          {product.title}
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Rental Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#2874f0]">
                ₹{product.basePricePerMonth}
              </span>
              <span className="text-sm text-gray-600 font-medium">/day</span>
            </div>
          </div>
          
          {product.ratingCount !== null && product.ratingCount > 0 && (
            <div className="text-right">
              <span className="text-xs text-gray-500 block mb-1">Reviews</span>
              <span className="text-sm font-semibold text-gray-700">
                {product.ratingCount}
              </span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <div className="mt-2 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#2874f0] group-hover:gap-3 transition-all">
            View Details
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
