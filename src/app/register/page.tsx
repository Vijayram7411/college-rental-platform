"use client";

import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface College {
  id: string;
  name: string;
  domain: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [idCardFront, setIdCardFront] = useState("");
  const [idCardBack, setIdCardBack] = useState("");
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch colleges list
    fetch("/api/colleges")
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch(() => setError("Failed to load colleges"));
  }, []);

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

    if (file.size > 5 * 1024 * 1024) {
      setError(`ID card ${side} image is too large. Maximum size is 5MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const base64 = await convertToBase64(file);
      
      if (side === 'front') {
        setIdCardFront(base64);
        setFrontPreview(base64);
      } else {
        setIdCardBack(base64);
        setBackPreview(base64);
      }
    } catch (_err) {
      setError(`Failed to process ${side} image`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!collegeId) {
      setError("Please select your college");
      return;
    }
    
    if (!idCardFront || !idCardBack) {
      setError("Please upload both sides of your student ID");
      return;
    }
    
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          collegeId,
          phone,
          idCardFront,
          idCardBack,
          collegeEmail: collegeEmail || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }

      // Auto log in after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      setLoading(false);

      if (result?.error) {
        router.push("/login");
      } else {
        router.push(result?.url ?? "/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
      <div className="flipkart-shadow mb-6 rounded-sm bg-white p-8">
        <h1 className="mb-2 text-2xl font-bold text-[#212121]">Sign Up</h1>
        <p className="mb-6 text-sm text-gray-600">
          Create your account to start renting
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-[#212121]">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-[#212121]">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-[#212121]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="college" className="block text-sm font-semibold text-[#212121]">
              Select Your College <span className="text-red-500">*</span>
            </label>
            <select
              id="college"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              required
              className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
            >
              <option value="">Choose your college</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-[#212121]">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter your phone number"
              className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#212121]">
              Student ID Card <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-2">
              Upload clear photos of both sides of your student ID
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="idFront" className="block text-xs font-medium text-gray-700 mb-1">
                  Front Side
                </label>
                <input
                  id="idFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'front')}
                  required
                  className="w-full text-sm"
                />
                {frontPreview && (
                  <img src={frontPreview} alt="ID Front" className="mt-2 w-full h-32 object-cover rounded border" />
                )}
              </div>
              
              <div>
                <label htmlFor="idBack" className="block text-xs font-medium text-gray-700 mb-1">
                  Back Side
                </label>
                <input
                  id="idBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'back')}
                  required
                  className="w-full text-sm"
                />
                {backPreview && (
                  <img src={backPreview} alt="ID Back" className="mt-2 w-full h-32 object-cover rounded border" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="collegeEmail" className="block text-sm font-semibold text-[#212121]">
              College Email (Optional)
            </label>
            <input
              id="collegeEmail"
              type="email"
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              placeholder="your.name@college.edu"
              className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
            />
            <p className="text-xs text-gray-500">For additional verification</p>
          </div>
          {error && (
            <div className="rounded-sm bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-sm bg-[#ff9f00] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#e68a00] disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "SIGN UP"}
          </button>
        </form>
        
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-[#2874f0] hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
      <div className="flipkart-shadow rounded-sm bg-white p-4 text-center text-xs text-gray-600">
        By continuing, you agree to our Terms of Use and Privacy Policy
      </div>
    </div>
  );
}
