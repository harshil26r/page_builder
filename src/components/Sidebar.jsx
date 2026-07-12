"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LuLayoutGrid, LuSparkles, LuLogOut, LuUser } from "react-icons/lu";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Error logging out:", err);
    }
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const isStudio = pathname === "/studio" || pathname.startsWith("/editpage");
  const isDash = pathname === "/";

  return (
    <aside className="fixed left-0 top-0 flex flex-col w-20 items-center bg-[#0a0f1d]/95 border-r border-white/10 text-slate-400 backdrop-blur-2xl py-6 px-3 h-screen z-50 shrink-0 shadow-2xl">
      {/* Brand Icon / Logo */}
      <div className="flex flex-col items-center flex-1 space-y-8 w-full">
        <Link
          href="/"
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white font-black text-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Aura Page Builder"
        >
          <span className="tracking-tighter font-mono">A</span>
          <div className="absolute inset-0 rounded-2xl bg-indigo-400/30 opacity-0 blur-md group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-4 w-full items-center">
          {/* Dashboard Link */}
          <Link
            href="/"
            className={`relative group flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
              isDash
                ? "bg-indigo-500/20 text-cyan-300 border border-indigo-400/40 shadow-lg shadow-indigo-500/10"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
            }`}
            title="Pages Directory"
          >
            <LuLayoutGrid className="text-xl transition-transform group-hover:scale-110" />
          </Link>

          {/* Studio Link */}
          <Link
            href="/studio"
            className={`relative group flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
              isStudio
                ? "bg-indigo-500/20 text-cyan-300 border border-indigo-400/40 shadow-lg shadow-indigo-500/10"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
            }`}
            title="Visual Studio Builder"
          >
            <LuSparkles className="text-xl transition-transform group-hover:scale-110" />
          </Link>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col space-y-3 w-full items-center pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogOut}
          className="group flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/30 border border-transparent transition-all duration-200"
          title="Sign Out"
        >
          <LuLogOut className="text-lg transition-transform group-hover:-translate-x-0.5" />
        </button>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/80 border border-white/10 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300 transition-all duration-200 cursor-pointer relative"
          title="Active Creator Session"
        >
          <LuUser className="text-lg" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0f1d] shadow-sm status-dot-active" />
        </div>
      </div>
    </aside>
  );
}
