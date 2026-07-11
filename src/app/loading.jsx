import React from "react";
import { HiSparkles } from "react-icons/hi";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070a12] text-white flex items-center justify-center font-sans">
      <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <HiSparkles className="w-5 h-5 text-indigo-400 animate-spin" />
        <span className="text-xs font-semibold text-slate-300">Loading Aura Studio...</span>
      </div>
    </div>
  );
}
