"use client";

import Link from "next/link";
import { PenLine } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";

export default function WriteBlogCard() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="group relative min-h-[300px] overflow-hidden rounded-3xl border-2 border-dashed border-gray-200 bg-white transition-all hover:border-amber-500 dark:border-gray-800 dark:bg-slate-900 dark:hover:border-amber-500">
      {!isLoaded ? (
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-slate-800" />
          <div className="mb-2 h-6 w-32 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />
        </div>
      ) : isSignedIn ? (
        <Link href="/write-blog" className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 transition-transform group-hover:scale-110 dark:bg-amber-900/30">
            <PenLine className="h-8 w-8 text-amber-600 dark:text-amber-500" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Write a Journal</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Share your thoughts, experiences, and expertise with the community.</p>
        </Link>
      ) : (
        <SignInButton mode="modal">
          <button className="flex h-full w-full flex-col items-center justify-center p-6 text-center focus:outline-none">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-transform group-hover:scale-110 dark:bg-slate-800">
              <PenLine className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Write a Journal</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to share your thoughts, experiences, and expertise.</p>
          </button>
        </SignInButton>
      )}
    </div>
  );
}