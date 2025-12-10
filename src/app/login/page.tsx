"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(result?.url ?? callbackUrl);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
      <div className="flipkart-shadow mb-6 rounded-sm bg-white p-8">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Login</h1>
        <p className="mb-6 text-sm text-gray-600">
          Get access to your orders and rentals
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-neutral-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="campus-input"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-neutral-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="campus-input"
            />
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
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
        
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl })}
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
            New to College Rentals?{" "}
            <a
              href="/register"
              className="font-semibold text-brand-orange-600 hover:underline"
            >
              Create an account
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
