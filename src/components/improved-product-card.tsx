"use client";

import { useState } from "react";
import Link from "next/link";

interface ImprovedProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    basePricePerMonth: number;
    originalPricePerMonth: number | null;
    thumbnailUrl: string;
    rating: number | null;
    ratingCount: number | null;
    category: {
      name: string;
    };
  };
}

export function ImprovedProductCard({ product }: ImprovedProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasDiscount =
    product.originalPricePerMonth &&
    product.originalPricePerMonth > product.basePricePerMonth;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPricePerMonth! - product.basePricePerMonth) /
          product.originalPricePerMonth!) *
          100
      )
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flipkart-shadow-hover overflow-hidden rounded-sm bg-white transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {!imageError && product.thumbnailUrl ? (
            <img
              src={product.thumbnailUrl}
              alt={product.title}
              className={`h-full w-full object-cover transition-transform duration-300 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <span className="text-6xl">📦</span>
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute left-2 top-2 rounded-sm bg-[#388e3c] px-2 py-1 text-xs font-bold text-white shadow-md">
              {discountPercent}% OFF
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute right-2 top-2 rounded-sm bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium text-gray-700 shadow-md">
            {product.category.name}
          </div>

          {/* Quick View Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2874f0]">
              View Details →
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium text-[#212121] group-hover:text-[#2874f0] transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating !== null &&
            product.ratingCount !== null &&
            product.ratingCount > 0 && (
              <div className="mb-2 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-sm bg-[#388e3c] px-2 py-0.5 text-xs font-semibold text-white">
                  {product.rating.toFixed(1)} ★
                </span>
                <span className="text-xs text-gray-600">
                  ({product.ratingCount})
                </span>
              </div>
            )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#212121]">
              ₹{product.basePricePerMonth}
            </span>
            <span className="text-xs text-gray-600">/day</span>
          </div>

          {hasDiscount && (
            <div className="mt-1">
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPricePerMonth}
              </span>
            </div>
          )}

          {/* Description Preview */}
          <p className="mt-2 line-clamp-2 text-xs text-gray-600">
            {product.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
