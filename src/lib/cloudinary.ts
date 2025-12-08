// Cloudinary Image Upload Utility
// Add these to .env:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
// CLOUDINARY_API_KEY="your-api-key"
// CLOUDINARY_API_SECRET="your-api-secret"

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (server-side only)
if (process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload image to Cloudinary
 * @param base64Image - Base64 encoded image string
 * @param folder - Cloudinary folder (e.g., "products", "profiles")
 * @returns Cloudinary URL
 */
export async function uploadToCloudinary(
  base64Image: string,
  folder: string = "products"
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `college-rental/${folder}`,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" }, // Max dimensions
        { quality: "auto:good" }, // Automatic quality optimization
        { fetch_format: "auto" }, // Automatic format (WebP when supported)
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param base64Images - Array of base64 encoded images
 * @param folder - Cloudinary folder
 * @returns Array of Cloudinary URLs
 */
export async function uploadMultipleToCloudinary(
  base64Images: string[],
  folder: string = "products"
): Promise<string[]> {
  const uploadPromises = base64Images.map((image) =>
    uploadToCloudinary(image, folder)
  );
  return Promise.all(uploadPromises);
}

/**
 * Delete image from Cloudinary
 * @param imageUrl - Cloudinary image URL
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from URL
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    const folder = parts.slice(-3, -1).join("/");
    const publicId = `${folder}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // Don't throw - deletion failure shouldn't break the app
  }
}

/**
 * Get optimized image URL with transformations
 * @param imageUrl - Original Cloudinary URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized URL
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  width?: number,
  height?: number
): string {
  if (!imageUrl.includes("cloudinary.com")) {
    return imageUrl; // Return as-is if not a Cloudinary URL
  }

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push("c_limit", "q_auto", "f_auto");

  const transformation = transformations.join(",");
  return imageUrl.replace("/upload/", `/upload/${transformation}/`);
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
