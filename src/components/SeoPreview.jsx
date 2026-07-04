"use client";
import React, { useState } from "react";
import { HiGlobe, HiEye, HiPhotograph, HiSparkles } from "react-icons/hi";

export default function SeoPreview({
  title = "",
  subText = "",
  url = "",
  metaTitle = "",
  metaDescription = "",
  ogImage = "",
  onChange,
}) {
  const [activePlatform, setActivePlatform] = useState("google");

  const effectiveTitle = metaTitle || title || "Untitled Page";
  const effectiveDescription =
    metaDescription || subText || "Discover this page created with Rapid Page Builder.";
  const displayUrl = url ? `https://yourdomain.com/${url.replace(/^\//, "")}` : "https://yourdomain.com/my-page";

  const handleFieldChange = (field, val) => {
    if (onChange) {
      onChange(field, val);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="font-bold text-slate-200 flex items-center gap-2 text-sm">
          <HiGlobe className="text-indigo-400 text-base" /> SEO & Social Share Preview
        </h4>
        <div className="flex bg-slate-950 p-0.5 border border-slate-800 rounded-lg font-semibold">
          <button
            type="button"
            onClick={() => setActivePlatform("google")}
            className={`px-2.5 py-1 rounded-md transition ${
              activePlatform === "google" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("twitter")}
            className={`px-2.5 py-1 rounded-md transition ${
              activePlatform === "twitter" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Twitter / X
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("facebook")}
            className={`px-2.5 py-1 rounded-md transition ${
              activePlatform === "facebook" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Facebook
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-400 font-semibold">Meta Title</label>
            <span
              className={`text-[10px] ${
                effectiveTitle.length > 60 ? "text-amber-400 font-bold" : "text-slate-500"
              }`}
            >
              {effectiveTitle.length} / 60 chars
            </span>
          </div>
          <input
            type="text"
            placeholder={title || "Enter custom SEO title"}
            value={metaTitle}
            onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-slate-400 font-semibold">Meta Description</label>
            <span
              className={`text-[10px] ${
                effectiveDescription.length > 160 ? "text-amber-400 font-bold" : "text-slate-500"
              }`}
            >
              {effectiveDescription.length} / 160 chars
            </span>
          </div>
          <textarea
            rows={2}
            placeholder={subText || "Enter search snippet description"}
            value={metaDescription}
            onChange={(e) => handleFieldChange("metaDescription", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Social Share Image URL (og:image)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/banner.png"
              value={ogImage}
              onChange={(e) => handleFieldChange("ogImage", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Live SERP / Card Preview */}
      <div className="pt-2">
        <label className="block text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
          <HiEye className="text-indigo-400" /> Live Preview Snippet:
        </label>

        {activePlatform === "google" && (
          <div className="bg-white text-slate-900 rounded-xl p-4 shadow-md font-sans border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-600 truncate">
              <div className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[9px]">
                R
              </div>
              <span className="font-medium text-slate-800">Rapid Page Builder</span>
              <span className="text-slate-400">› {url || "page"}</span>
            </div>
            <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
              {effectiveTitle}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {effectiveDescription}
            </p>
          </div>
        )}

        {activePlatform === "twitter" && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            {ogImage ? (
              <img src={ogImage} alt="Twitter Preview" className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-32 bg-slate-900 flex items-center justify-center text-slate-600 gap-2">
                <HiPhotograph className="text-2xl" /> No image provided
              </div>
            )}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase">{displayUrl}</span>
              <h4 className="font-bold text-slate-200 text-xs truncate">{effectiveTitle}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-normal">{effectiveDescription}</p>
            </div>
          </div>
        )}

        {activePlatform === "facebook" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {ogImage ? (
              <img src={ogImage} alt="Facebook Preview" className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-32 bg-slate-950 flex items-center justify-center text-slate-600 gap-2">
                <HiPhotograph className="text-2xl" /> No image provided
              </div>
            )}
            <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase">{displayUrl}</span>
              <h4 className="font-bold text-slate-100 text-xs truncate">{effectiveTitle}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{effectiveDescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
