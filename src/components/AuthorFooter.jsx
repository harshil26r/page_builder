"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaRegUser, FaRegEnvelope, FaRegClock, FaTimes } from "react-icons/fa";

export default function AuthorFooter({ blog }) {
  const [isOpen, setIsOpen] = useState(false);

  const createdBy = blog?.createdBy || "Admin";
  const authorEmail = blog?.authorEmail || "";
  const modifiedBy = blog?.modifiedBy || createdBy;
  const createdAtFormatted = blog?.createdAt
    ? blog.createdAt instanceof Date
      ? blog.createdAt.toLocaleString()
      : String(blog.createdAt)
    : "N/A";
  const initial = (String(createdBy).charAt(0) || "A").toUpperCase();

  return (
    <>
      <footer className="border-t border-white/10 bg-[#070a12]/50 py-8 text-center text-xs text-slate-500 relative">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Aura Studio. All rights reserved.</p>

          {/* Author Badge Link in Footer */}
          {Boolean(blog?.showAuthor) && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-all text-xs font-medium shadow-sm active:scale-95 cursor-pointer"
              title="Click to view author details"
            >
              <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                {initial}
              </div>
              <span>Author: <strong className="text-white">{createdBy}</strong></span>
            </button>
          )}

          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <Link
              href="/"
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition"
            >
              Aura Studio Page Builder
            </Link>
          </p>
        </div>
      </footer>

      {/* Floating Author Detail Card Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-slate-900/95 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-left text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Author Profile Details
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Profile Main info */}
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20 font-mono shrink-0">
                {initial}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="font-bold text-lg text-white flex items-center gap-2 truncate">
                  <FaRegUser className="text-sm text-cyan-400 shrink-0" /> {createdBy}
                </h4>
                {authorEmail && (
                  <p className="text-xs text-slate-400 flex items-center gap-2 truncate">
                    <FaRegEnvelope className="text-xs text-slate-500 shrink-0" /> {authorEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata Stats */}
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-xs space-y-2 font-mono text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Published Date:</span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <FaRegClock className="text-xs text-cyan-400" /> {createdAtFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-slate-500">Last Modified By:</span>
                <span className="font-bold text-slate-200">{modifiedBy}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
