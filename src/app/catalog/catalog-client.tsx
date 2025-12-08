"use client";

import { useState, useMemo } from "react";
import { CatalogProductCard } from "./catalog-product-card";

interface Product {
  id: string;
  title: string;
  description: string;
  basePricePerMonth: number;
  originalPricePerMonth: number | null;
  thumbnailUrl: string;
  images: string;
  rating: number | null;
  ratingCount: number | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CatalogClientProps {
  products: Product[];
  categories: Category[];
}

export function CatalogClient({ products, categories }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category.slug === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(
      (p) =>
        p.basePricePerMonth >= priceRange[0] &&
        p.basePricePerMonth <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.basePricePerMonth - b.basePricePerMonth);
        break;
      case "price-high":
        filtered.sort((a, b) => b.basePricePerMonth - a.basePricePerMonth);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        // Already sorted by createdAt desc from server
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

  const maxPrice = Math.max(...products.map((p) => p.basePricePerMonth), 10000);

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flipkart-shadow rounded-sm bg-white p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#212121]">Catalog</h1>
          <p className="text-sm text-gray-600">
            Browse items available for rent from your college
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-sm border border-gray-300 py-3 pl-12 pr-4 text-sm outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0] focus:ring-opacity-20"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px,1fr]">
        {/* Filters Sidebar */}
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flipkart-shadow rounded-sm bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-[#212121]">Category</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === "all"}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-4 w-4 text-[#2874f0] focus:ring-[#2874f0]"
                />
                <span className="text-sm text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.slug}
                    checked={selectedCategory === category.slug}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-[#2874f0] focus:ring-[#2874f0]"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flipkart-shadow rounded-sm bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-[#212121]">
              Price Range (per day)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                  }
                  className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])
                  }
                  className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
                />
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </p>
            </div>
          </div>

          {/* Sort By */}
          <div className="flipkart-shadow rounded-sm bg-white p-4">
            <h3 className="mb-3 text-sm font-bold text-[#212121]">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2874f0]"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory !== "all" || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setPriceRange([0, maxPrice]);
                setSortBy("newest");
              }}
              className="w-full rounded-sm border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-[#212121] hover:border-[#2874f0] hover:text-[#2874f0]"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flipkart-shadow rounded-sm bg-white p-12 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className="mb-2 text-lg font-semibold text-[#212121]">
                No products found
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange([0, maxPrice]);
                }}
                className="rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
