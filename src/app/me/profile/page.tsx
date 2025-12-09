"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  collegeName: string | null;
  ownerProfile: {
    phone: string;
    status: string;
  } | null;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/me/profile");

      if (res.status === 401) {
        router.push("/login?callbackUrl=/me/profile");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold text-[#212121] mb-6">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-[#2874f0] to-[#1c5bbf] h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex items-start -mt-16 mb-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white border-4 border-white shadow-lg text-4xl font-bold text-[#2874f0]">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name || "User"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                profile.name?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div className="ml-6 mt-20">
              <h2 className="text-2xl font-bold text-[#212121]">
                {profile.name || "User"}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#2874f0] px-3 py-1 text-xs font-medium text-white">
                  {profile.role}
                </span>
                {profile.ownerProfile && (
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      profile.ownerProfile.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : profile.ownerProfile.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile.ownerProfile.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#212121] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-base text-[#212121]">{profile.name || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-base text-[#212121]">{profile.email || "Not provided"}</p>
            </div>
            {profile.ownerProfile && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-base text-[#212121]">{profile.ownerProfile.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-base text-[#212121]">{joinDate}</p>
            </div>
          </div>
        </div>

        {/* College Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-[#212121] mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            College Information
          </h3>
          {profile.collegeName ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">College Name</label>
                <p className="text-base text-[#212121] font-medium">{profile.collegeName}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No college information available</p>
          )}
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Account Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Can Browse Items</p>
            <p className="text-2xl font-bold text-green-600">✓ Yes</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Can Rent Items</p>
            <p className="text-2xl font-bold text-green-600">✓ Yes</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Can List Items</p>
            <p className="text-2xl font-bold text-green-600">
              {profile.ownerProfile?.status === "APPROVED" ? "✓ Yes" : "⏳ Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
