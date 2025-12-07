"use client";

import { FormEvent, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function OwnerApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    phone: "", 
    collegeName: "", 
    collegeEmail: "",
    idCardFront: "",
    idCardBack: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>, side: 'front' | 'back') {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(`ID card ${side} image is too large. Maximum size is 5MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const base64 = await convertToBase64(file);
      
      if (side === 'front') {
        setForm(prev => ({ ...prev, idCardFront: base64 }));
        setFrontPreview(base64);
      } else {
        setForm(prev => ({ ...prev, idCardBack: base64 }));
        setBackPreview(base64);
      }
    } catch (err) {
      setError(`Failed to process ${side} image`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Validate: ID card is mandatory
    if (!form.idCardFront || !form.idCardBack) {
      setError("Please upload both sides of your college ID card");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/owner/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/owner/apply");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to submit application");
      } else {
        setMessage("Application submitted. An admin will review it soon.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-[#212121]">Owner Application</h1>
      <p className="text-sm text-gray-600">
        Share your contact and verification details so admins can approve you as
        an item owner.
      </p>
      
      <form onSubmit={handleSubmit} className="flipkart-shadow space-y-6 rounded-sm bg-white p-6">
        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="Enter your phone number"
            className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
          />
        </div>

        {/* College Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            College Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            value={form.collegeName}
            onChange={(e) => updateField("collegeName", e.target.value)}
            placeholder="Enter your college name"
            className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
          />
        </div>

        {/* College Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#212121]">
            College Email ID <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="email"
            value={form.collegeEmail}
            onChange={(e) => updateField("collegeEmail", e.target.value)}
            placeholder="your.name@college.edu"
            className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
          />
          <p className="text-xs text-gray-500">
            Optional: Provide your official college email address
          </p>
        </div>

        {/* ID Card Front */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[#212121]">
            College ID Card (Front Side) <span className="text-red-600">*</span>
          </label>
          
          <div className="rounded-sm border-2 border-dashed border-[#2874f0] p-6 text-center">
            <input
              type="file"
              id="id-front"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'front')}
              className="hidden"
            />
            <label htmlFor="id-front" className="cursor-pointer">
              {frontPreview ? (
                <div className="space-y-2">
                  <img
                    src={frontPreview}
                    alt="ID Card Front"
                    className="mx-auto h-48 w-auto rounded-sm object-contain"
                  />
                  <p className="text-sm font-semibold text-[#2874f0]">
                    Click to change image
                  </p>
                </div>
              ) : (
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
                      Click to upload front side
                    </p>
                    <p className="text-xs text-gray-600">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* ID Card Back */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[#212121]">
            College ID Card (Back Side) <span className="text-red-600">*</span>
          </label>
          
          <div className="rounded-sm border-2 border-dashed border-[#2874f0] p-6 text-center">
            <input
              type="file"
              id="id-back"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'back')}
              className="hidden"
            />
            <label htmlFor="id-back" className="cursor-pointer">
              {backPreview ? (
                <div className="space-y-2">
                  <img
                    src={backPreview}
                    alt="ID Card Back"
                    className="mx-auto h-48 w-auto rounded-sm object-contain"
                  />
                  <p className="text-sm font-semibold text-[#2874f0]">
                    Click to change image
                  </p>
                </div>
              ) : (
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
                      Click to upload back side
                    </p>
                    <p className="text-xs text-gray-600">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-sm bg-blue-50 p-4 text-xs text-gray-700">
          <p className="mb-2 font-semibold">📋 Required Documents:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><span className="font-semibold">Mandatory:</span> Upload clear photos of your college ID card (both front and back sides)</li>
            <li><span className="font-semibold">Optional:</span> Provide your college email address for additional verification</li>
            <li>Make sure all text on ID card is clearly readable</li>
            <li>Images should be under 5MB each</li>
            <li>Supported formats: JPG, PNG, WEBP</li>
          </ul>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="rounded-sm bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-sm bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full rounded-sm bg-[#ff9f00] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#e68a00] disabled:opacity-60"
        >
          {uploading ? "Processing images..." : loading ? "Submitting..." : "SUBMIT APPLICATION"}
        </button>
      </form>
    </div>
  );
}
