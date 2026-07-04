"use client";
import React, { useState } from "react";
import { HiChevronDown, HiSearch, HiSparkles, HiQuestionMarkCircle } from "react-icons/hi";

export default function FaqBlock({ data = {} }) {
  const {
    title = "Frequently Asked Questions",
    subtitle = "Everything you need to know about our product and services.",
    items = [],
  } = data;

  // Open first item by default for great initial view
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
    <section className="py-4 sm:py-6 max-w-3xl mx-auto space-y-6 font-sans px-1 sm:px-0">
      {/* Section Header */}
      <div className="text-center space-y-2 px-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold backdrop-blur-md">
          <HiSparkles className="w-3.5 h-3.5" />
          <span>Support & Answers</span>
        </div>
        {title && (
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Control Bar: Search & Expand/Collapse */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-lg">
        {/* Search Bar */}
        <div className="relative flex-1">
          <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 justify-end text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition hover:text-white border border-slate-700/50"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition hover:text-white border border-slate-700/50"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-10 px-4 text-slate-500 text-xs sm:text-sm bg-slate-900/40 rounded-2xl border border-slate-800/80 flex flex-col items-center gap-2">
          <HiQuestionMarkCircle className="text-2xl text-slate-600" />
          <span>No questions match &ldquo;{searchQuery}&rdquo;. Try another search term.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, fIdx) => {
            const isOpen = !!openFaq[fIdx];
            return (
              <div
                key={fIdx}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 backdrop-blur-xl ${
                  isOpen
                    ? "border-indigo-500/50 bg-slate-900/90 shadow-lg ring-1 ring-indigo-500/20"
                    : "border-slate-800/80 bg-slate-900/50 hover:border-slate-700/80 hover:bg-slate-900/70"
                }`}
              >
                {/* Question Header Button */}
                <button
                  type="button"
                  onClick={() => toggleFaq(fIdx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
                    {item.category && (
                      <span className="w-fit text-[10px] uppercase font-extrabold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-md border border-indigo-500/30 shrink-0">
                        {item.category}
                      </span>
                    )}
                    <span className="text-sm sm:text-base font-bold text-white leading-snug break-words">
                      {item.question}
                    </span>
                  </div>

                  <div className={`p-1 rounded-lg transition-colors shrink-0 ${isOpen ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400"}`}>
                    <HiChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Answer Content Panel */}
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 pt-4 bg-slate-950/40 rounded-b-2xl">
                    <div className="border-l-2 border-l-indigo-500 pl-3.5 py-0.5 leading-relaxed text-slate-300 font-normal break-words">
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
