"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "furniture", name: "Furniture", icon: "🛋️" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "musical-instruments", name: "Musical Instruments", icon: "🎸" },
  { id: "appliances", name: "Appliances", icon: "🔌" },
  { id: "clothing", name: "Clothing", icon: "👕" },
  { id: "tools", name: "Tools", icon: "🔧" },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categorySlug: "",
    basePricePerMonth: "",
    originalPricePerMonth: "",
    minRentalDays: "1",
    maxRentalDays: "30",
  });

  // Fetch existing product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/owner/products/${productId}`);
        
        if (res.status === 401) {
          router.push("/login?callbackUrl=/owner/products");
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Failed to load product");
          setFetchingProduct(false);
          return;
        }

        const data = await res.json();
        const product = data.product;

        // Parse images from JSON string
        const images = typeof product.images === "string" 
          ? JSON.parse(product.images) 
          : product.images;

        setForm({
          title: product.title,
          description: product.description,
          categorySlug: product.category.slug,
          basePricePerMonth: product.basePricePerMonth.toString(),
          originalPricePerMonth: product.originalPricePerMonth?.toString() || "",
          minRentalDays: "1",
          maxRentalDays: "30",
        });

        setExistingImages(images);
        setImagePreviews(images);
        setFetchingProduct(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
        setFetchingProduct(false);
      }
    }

    fetchProduct();
  }, [productId, router]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const totalImages = imagePreviews.length + newFiles.length;

    if (totalImages > 10) {
      setError("Maximum 10 images allowed");
      return;
    }

    // Validate file size
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`Image ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
    }

    // Create previews
    const newPreviews: string[] = [];
    for (const file of newFiles) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setImageFiles([...imageFiles, ...newFiles]);
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage(index: number) {
    // Remove from previews
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    // Check if this is an existing image or a new upload
    if (index < existingImages.length) {
      // It's an existing image
      const newExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExisting);
    } else {
      // It's a new file
      const fileIndex = index - existingImages.length;
      const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
      setImageFiles(newFiles);
    }
  }

  async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setUploading(true);
    setError(null);

    if (!form.categorySlug) {
      setError("Please select a category");
      setLoading(false);
      setUploading(false);
      return;
    }

    if (imagePreviews.length < 3) {
      setError("Please upload at least 3 product images");
      setLoading(false);
      setUploading(false);
      return;
    }

    try {
      // Combine existing images with new uploads
      const allImages: string[] = [];
      
      // Add existing images that are still in previews
      for (let i = 0; i < existingImages.length; i++) {
        allImages.push(existingImages[i]);
      }
      
      // Convert and add new images
      for (let i = 0; i < imageFiles.length; i++) {
        try {
          const base64 = await convertToBase64(imageFiles[i]);
          allImages.push(base64);
        } catch (_err) {
          setError(`Failed to process image ${i + 1}. Please try again.`);
          setLoading(false);
          setUploading(false);
          return;
        }
      }

      setUploading(false);

      // Update product
      const res = await fetch(`/api/owner/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          basePricePerMonth: parseInt(form.basePricePerMonth),
          originalPricePerMonth: form.originalPricePerMonth
            ? parseInt(form.originalPricePerMonth)
            : null,
          images: allImages,
          thumbnailUrl: allImages[0],
        }),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/owner/products");
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Failed to update product");
        setLoading(false);
        return;
      }

      router.push("/owner/products");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
      setUploading(false);
    }
  }

  if (fetchingProduct) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="flipkart-shadow rounded-sm bg-white p-8 text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-sm text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="flipkart-shadow rounded-sm bg-white p-8 text-center">
          <div className="mb-4 text-4xl">❌</div>
          <p className="text-sm text-red-600">{error}</p>
          <Link
            href="/owner/products"
            className="mt-4 inline-block rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c5bbf]"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">Edit Product</h1>
          <p className="text-sm text-gray-600">
            Update your product details
          </p>
        </div>
        <Link
          href="/owner/products"
          className="rounded-sm border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-[#212121] hover:border-[#2874f0]"
        >
          ← Back
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flipkart-shadow space-y-6 rounded-sm bg-white p-6">
        {/* Product Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            Product Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g., iPhone 13 Pro Max 256GB"
            className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            required
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your product in detail..."
            rows={4}
            className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            Category <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateField("categorySlug", cat.id)}
                className={`flex flex-col items-center gap-2 rounded-sm border-2 p-4 transition-all ${
                  form.categorySlug === cat.id
                    ? "border-[#2874f0] bg-blue-50"
                    : "border-gray-300 hover:border-[#2874f0]"
                }`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-[#212121]">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#212121]">
              Rental Price (per day) <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                ₹
              </span>
              <input
                type="number"
                required
                min="1"
                value={form.basePricePerMonth}
                onChange={(e) => updateField("basePricePerMonth", e.target.value)}
                placeholder="500"
                className="w-full rounded-sm border border-gray-300 py-3 pl-8 pr-4 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#212121]">
              Original Price (optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                ₹
              </span>
              <input
                type="number"
                min="1"
                value={form.originalPricePerMonth}
                onChange={(e) =>
                  updateField("originalPricePerMonth", e.target.value)
                }
                placeholder="800"
                className="w-full rounded-sm border border-gray-300 py-3 pl-8 pr-4 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>
            <p className="text-xs text-gray-500">
              Show discount if original price is higher
            </p>
          </div>
        </div>

        {/* Product Images */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[#212121]">
            Product Images <span className="text-red-600">*</span>
          </label>
          
          {/* Image Requirement Notice */}
          <div className="rounded-sm bg-red-50 border-2 border-red-200 p-3">
            <div className="flex items-start gap-2">
              <span className="text-red-600 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-bold text-red-800">Minimum 3 Images Required</p>
                <p className="text-xs text-red-700 mt-1">
                  You must have at least 3 product images. Maximum 10 images allowed (5MB each).
                </p>
                {imagePreviews.length > 0 && (
                  <p className="text-xs font-semibold text-red-800 mt-2">
                    Current: {imagePreviews.length} / 3 minimum {imagePreviews.length >= 3 ? "✓" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Button */}
          <div className="rounded-sm border-2 border-dashed border-[#2874f0] p-6 text-center">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-blue-100 p-4">
                  <svg
                    className="h-8 w-8 text-[#2874f0]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2874f0]">
                    Click to add more images
                  </p>
                  <p className="text-xs text-gray-600">
                    or drag and drop
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP up to 5MB each
                </p>
              </div>
            </label>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-sm border-2 border-gray-200"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 rounded-sm bg-[#2874f0] px-2 py-0.5 text-xs font-semibold text-white">
                      Thumbnail
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-sm bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || imagePreviews.length < 3 || !form.categorySlug}
            className="flex-1 rounded-sm bg-[#ff9f00] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#e68a00] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Processing Images..."
              : loading
              ? "Updating Product..."
              : "UPDATE PRODUCT"}
          </button>
          <Link
            href="/owner/products"
            className="rounded-sm border-2 border-gray-300 px-6 py-3 text-sm font-bold text-[#212121] hover:border-[#2874f0]"
          >
            Cancel
          </Link>
        </div>
        
        {/* Validation Helper */}
        {(imagePreviews.length < 3 || !form.categorySlug) && (
          <div className="rounded-sm bg-yellow-50 p-3 text-xs text-yellow-800">
            <p className="font-semibold mb-1">Before submitting, please ensure:</p>
            <ul className="ml-4 list-disc space-y-1">
              {!form.categorySlug && <li>Select a category</li>}
              {imagePreviews.length < 3 && <li>Have at least 3 product images (currently: {imagePreviews.length})</li>}
            </ul>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="rounded-sm bg-blue-50 p-4 text-center">
            <div className="mb-2 text-sm font-semibold text-[#2874f0]">
              Processing images...
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full animate-pulse bg-[#2874f0]" style={{ width: "100%" }}></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
