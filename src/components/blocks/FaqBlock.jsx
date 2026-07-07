"use client";
import React, { useState } from "react";
import { HiChevronDown, HiSearch, HiSparkles, HiQuestionMarkCircle } from "react-icons/hi";

export default function FaqBlock({ data = {} }) {
  const {
    title = "Frequently Asked Questions",
    subtitle = "Everything you need to know about our product and services.",
    items = [],
  } = data;

  const [openFaq, setOpenFaq] = useState({ 0: true });
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAll = () => {
    const allOpened = {};
    (items || []).forEach((_, i) => (allOpened[i] = true));
    setOpenFaq(allOpened);
  };

  const collapseAll = () => {
    setOpenFaq({});
  };

  const filteredItems = (items || []).filter(
    (item) =>
      item.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-8 sm:py-12 max-w-4xl mx-auto space-y-8 font-sans px-4">
      {/* Section Header */}
      <div className="text-center space-y-3 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold backdrop-blur-xl">
          <HiSparkles className="w-4 h-4 text-indigo-400" />
          <span>Support & Answers</span>
        </div>
        {title && (
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Control Bar: Search & Expand/Collapse */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-2xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 font-medium"
          />
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 justify-end text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={expandAll}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition hover:text-white border border-slate-800"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition hover:text-white border border-slate-800"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4 text-slate-400 text-xs sm:text-sm glass-panel rounded-3xl border border-slate-800 flex flex-col items-center gap-3">
          <HiQuestionMarkCircle className="text-3xl text-slate-500" />
          <span>No questions match &ldquo;{searchQuery}&rdquo;. Try another search term.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, fIdx) => {
            const isOpen = !!openFaq[fIdx];
            return (
              <div
                key={fIdx}
                className={`glass-panel rounded-3xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-xl"
                    : "hover:border-slate-700/80"
                }`}
              >
                {/* Question Header Button */}
                <button
                  type="button"
                  onClick={() => toggleFaq(fIdx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 text-xs sm:text-sm font-bold transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
                    {item.category && (
                      <span className="w-fit text-[10px] uppercase font-black text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-500/30 shrink-0">
                        {item.category}
                      </span>
                    )}
                    <span className="text-base sm:text-lg font-extrabold text-white leading-snug break-words">
                      {item.question}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${isOpen ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400"}`}>
                    <HiChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Answer Content Panel */}
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 pt-4 bg-slate-950/50">
                    <div className="border-l-2 border-l-indigo-500 pl-4 py-1 leading-relaxed text-slate-300 font-normal break-words">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
