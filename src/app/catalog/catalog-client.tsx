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
      <div className="flipkart-shadow rounded-lg bg-white p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-[#212121]">Discover & Rent</h1>
          <p className="text-sm text-gray-600">
            Browse {products.length} items available for rent from your college community
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for products, categories, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 py-4 pl-14 pr-12 text-sm text-gray-900 outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20 transition-all"
          />
          <svg
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* Filters Sidebar */}
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flipkart-shadow rounded-lg bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-[#2874f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-base font-bold text-[#212121]">Categories</h3>
            </div>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer rounded-md p-2 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === "all"}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-4 w-4 text-[#2874f0] focus:ring-[#2874f0]"
                />
                <span className="text-sm font-medium text-gray-700">All Categories</span>
                <span className="ml-auto text-xs text-gray-500">{products.length}</span>
              </label>
              {categories.map((category) => {
                const count = products.filter(p => p.category.slug === category.slug).length;
                return (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 cursor-pointer rounded-md p-2 hover:bg-gray-50 transition-colors"
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
                    <span className="ml-auto text-xs text-gray-500">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="flipkart-shadow rounded-lg bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-[#2874f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-base font-bold text-[#212121]">
                Price Range
              </h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-[#2874f0]/10 to-[#1c5bbf]/10 p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Per Day</p>
                <p className="text-lg font-bold text-[#2874f0]">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </p>
              </div>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full accent-[#2874f0]"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Max</label>
                  <input
                    type="number"
                    placeholder={maxPrice.toString()}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="flipkart-shadow rounded-lg bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-[#2874f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <h3 className="text-base font-bold text-[#212121]">Sort By</h3>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-medium outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20 cursor-pointer"
            >
              <option value="newest">🆕 Newest First</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="name">🔤 Name: A to Z</option>
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
              className="w-full rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:border-red-300 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div>
          {/* Results Header */}
          <div className="mb-5 flex items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2874f0]/10">
                <span className="text-lg font-bold text-[#2874f0]">{filteredProducts.length}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#212121]">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""} Found
                </p>
                <p className="text-xs text-gray-500">
                  {selectedCategory !== "all" 
                    ? `in ${categories.find(c => c.slug === selectedCategory)?.name}` 
                    : "across all categories"}
                </p>
              </div>
            </div>
            {filteredProducts.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Grid View
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flipkart-shadow rounded-lg bg-white p-16 text-center">
              <div className="mb-6 text-7xl">🔍</div>
              <h3 className="mb-3 text-xl font-bold text-[#212121]">
                No Products Found
              </h3>
              <p className="mb-6 text-sm text-gray-600 max-w-md mx-auto">
                We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange([0, maxPrice]);
                  setSortBy("newest");
                }}
                className="rounded-lg bg-[#2874f0] px-8 py-3 text-sm font-bold text-white hover:bg-[#1c5bbf] shadow-md transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
