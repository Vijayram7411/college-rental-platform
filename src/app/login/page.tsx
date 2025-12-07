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
        <h1 className="mb-2 text-2xl font-bold text-[#212121]">Login</h1>
        <p className="mb-6 text-sm text-gray-600">
          Get access to your orders and rentals
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              className="w-full rounded-sm border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
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
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New to College Rentals?{" "}
            <a
              href="/register"
              className="font-semibold text-[#2874f0] hover:underline"
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
