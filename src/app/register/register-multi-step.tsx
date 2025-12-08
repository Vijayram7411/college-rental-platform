"use client";

import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface College {
  id: string;
  name: string;
  domain: string;
}

export default function RegisterMultiStep() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1 fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  // Step 2 fields
  const [collegeId, setCollegeId] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [personPhoto, setPersonPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [idCardFront, setIdCardFront] = useState("");
  const [idCardBack, setIdCardBack] = useState("");
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'photo') {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too large. Maximum size is 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }

    setError(null);

    try {
      const base64 = await convertToBase64(file);
      
      if (type === 'front') {
        setIdCardFront(base64);
        setFrontPreview(base64);
      } else if (type === 'back') {
        setIdCardBack(base64);
        setBackPreview(base64);
      } else if (type === 'photo') {
        setPersonPhoto(base64);
        setPhotoPreview(base64);
      }
    } catch {
      setError("Failed to process image");
    }
  }

  function handleStep1Submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!name || !email || !password || !phone) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setStep(2);
  }

  async function handleStep2Submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!collegeId) {
      setError("Please select your college");
      return;
    }
    
    if (!aadhaarNumber || aadhaarNumber.length !== 8) {
      setError("Please enter both first 4 and last 4 digits of your Aadhaar number");
      return;
    }
    
    if (!personPhoto) {
      setError("Please upload your photo");
      return;
    }
    
    if (!idCardFront || !idCardBack) {
      setError("Please upload both sides of your student ID");
      return;
    }
    
    if (!acceptedTerms) {
      setError("You must accept the Terms and Conditions to register");
      return;
    }
    
    setLoading(true);

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
          aadhaarNumber,
          personPhoto,
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

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/select-role",
      });

      setLoading(false);

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/select-role");
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
        {/* Progress Indicator */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 1 ? 'bg-[#2874f0] text-white' : 'bg-green-500 text-white'} text-sm font-bold`}>
            {step === 1 ? '1' : '✓'}
          </div>
          <div className={`h-1 w-16 ${step === 2 ? 'bg-[#2874f0]' : 'bg-gray-300'}`}></div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step === 2 ? 'bg-[#2874f0] text-white' : 'bg-gray-300 text-gray-600'} text-sm font-bold`}>
            2
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-[#212121]">
          {step === 1 ? 'Sign Up' : 'Verification Details'}
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          {step === 1 ? 'Create your account - Step 1 of 2' : 'Complete your verification - Step 2 of 2'}
        </p>

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-[#212121]">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-[#212121]">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-[#212121]">
                Password <span className="text-red-500">*</span>
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
              className="w-full rounded-sm bg-[#2874f0] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#1c5bbf]"
            >
              CONTINUE TO VERIFICATION
            </button>
          </form>
        )}

        {/* STEP 2: Verification Details */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
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
              <label className="block text-sm font-semibold text-[#212121]">
                Student ID Card <span className="text-red-500">*</span>
              </label>
              <div className="rounded-sm bg-blue-50 border border-blue-200 p-3 mb-2">
                <p className="text-xs text-blue-800 font-semibold mb-1">📸 ID Photo Requirements:</p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                  <li>College name must be clearly visible</li>
                  <li>Take photo in good lighting</li>
                  <li>Avoid blur or glare</li>
                  <li>Ensure all text is readable</li>
                </ul>
              </div>
              
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
              <label className="block text-sm font-semibold text-[#212121]">
                Aadhaar Number (Partial) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="aadhaarFirst4" className="block text-xs font-medium text-gray-700 mb-1">
                    First 4 Digits
                  </label>
                  <input
                    id="aadhaarFirst4"
                    type="text"
                    value={aadhaarNumber.slice(0, 4)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setAadhaarNumber(value + aadhaarNumber.slice(4));
                    }}
                    required
                    maxLength={4}
                    placeholder="1234"
                    className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                  />
                </div>
                <div>
                  <label htmlFor="aadhaarLast4" className="block text-xs font-medium text-gray-700 mb-1">
                    Last 4 Digits
                  </label>
                  <input
                    id="aadhaarLast4"
                    type="text"
                    value={aadhaarNumber.slice(4, 8)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setAadhaarNumber(aadhaarNumber.slice(0, 4) + value);
                    }}
                    required
                    maxLength={4}
                    placeholder="5678"
                    className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                For privacy, we only collect first 4 and last 4 digits (e.g., 1234-XXXX-5678)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="photo" className="block text-sm font-semibold text-[#212121]">
                Your Photo <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-2">
                Upload a clear passport-size photo
              </p>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'photo')}
                required
                className="w-full text-sm"
              />
              {photoPreview && (
                <img src={photoPreview} alt="Your Photo" className="mt-2 w-32 h-32 object-cover rounded border" />
              )}
            </div>

            {/* Terms and Conditions Acceptance */}
            <div className="rounded-sm border-2 border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 cursor-pointer accent-[#2874f0]"
                />
                <label htmlFor="acceptTerms" className="cursor-pointer text-sm text-gray-700">
                  I have read and agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2874f0] underline hover:text-[#1c5bbf]"
                  >
                    Terms and Conditions
                  </a>
                  {" "}and understand that the Platform is not responsible for any damaged, lost, or missing items.
                  <span className="text-red-600"> *</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-sm bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-sm border-2 border-gray-300 px-4 py-3 text-sm font-bold text-[#212121] hover:border-[#2874f0]"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={loading || !acceptedTerms}
                className="flex-1 rounded-sm bg-[#ff9f00] px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-[#e68a00] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
              </button>
            </div>
          </form>
        )}
        
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
        By continuing, you agree to our{" "}
        <a href="/terms" className="text-[#2874f0] hover:underline">Terms of Use</a>
        {" "}and Privacy Policy
      </div>
    </div>
  );
}
