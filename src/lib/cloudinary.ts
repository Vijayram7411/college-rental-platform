// Cloudinary Image Optimization Utilities
// NOTE: Only use these when Cloudinary is set up
// Required environment variables:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
// CLOUDINARY_API_KEY="your-api-key"
// CLOUDINARY_API_SECRET="your-api-secret"

// IMPORTANT: Install cloudinary package first: npm install cloudinary next-cloudinary

// Uncomment the code below after installing cloudinary package:

/*
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (server-side only)
if (process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadToCloudinary(
  base64Image: string,
  folder: string = "products"
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `college-rental/${folder}`,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    const folder = parts.slice(-2, -1)[0];
    const publicId = `college-rental/${folder}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
}

export function getOptimizedImageUrl(
  imageUrl: string,
  width?: number,
  height?: number
): string {
  if (!imageUrl.includes("cloudinary.com")) {
    return imageUrl;
  }

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push("c_limit", "q_auto", "f_auto");

  const transformation = transformations.join(",");
  return imageUrl.replace("/upload/", `/upload/${transformation}/`);
}
*/

// Placeholder exports (remove when uncommenting above)
export function uploadToCloudinary(base64Image: string, folder?: string): Promise<string> {
  throw new Error("Cloudinary not configured. Install package and uncomment code.");
}

export function deleteFromCloudinary(imageUrl: string): Promise<void> {
  throw new Error("Cloudinary not configured. Install package and uncomment code.");
}

export function getOptimizedImageUrl(imageUrl: string, width?: number, height?: number): string {
  return imageUrl;
}
