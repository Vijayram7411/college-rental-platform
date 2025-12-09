import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  collegeId: z.string().min(3).max(200), // College name as text (field name kept for backward compatibility)
  phone: z.string().min(5).max(20),
  aadhaarNumber: z.string().length(8).regex(/^\d{8}$/, "Aadhaar must be 8 digits (first 4 and last 4)"),
  personPhoto: z.string().min(1),
  idCardFront: z.string().min(1),
  idCardBack: z.string().min(1),
  collegeEmail: z.string().email().optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  thumbnailUrl: z.string().url(),
  images: z.array(z.string().url()).min(1),
  basePricePerMonth: z.number().int().positive(),
  originalPricePerMonth: z.number().int().positive().optional(),
  categoryId: z.string().cuid(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().default(1),
  durationMonths: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().cuid(),
  quantity: z.number().int().positive().optional(),
  durationMonths: z.number().int().positive().optional(),
});

export const deleteCartItemSchema = z.object({
  itemId: z.string().cuid(),
});

export const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

export const createAddressSchema = addressSchema;

export const updateAddressSchema = addressSchema.partial().extend({
  id: z.string().cuid(),
});

export const deleteAddressSchema = z.object({
  id: z.string().cuid(),
});

export const setDefaultAddressSchema = z.object({
  id: z.string().cuid(),
});

export const checkoutSchema = z.object({
  address: addressSchema,
});



export const adminOwnerDecisionSchema = z.object({
  ownerProfileId: z.string().cuid(),
  action: z.enum(["APPROVE", "REJECT"]),
});

export const createReviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const updateReviewSchema = z.object({
  id: z.string().cuid(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});
