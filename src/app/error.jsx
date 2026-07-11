"use client";

import React, { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App boundary error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070a12] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Something went wrong</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          An unexpected error occurred. Click below to reload the segment.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-600/30"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
