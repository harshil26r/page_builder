"use client";
import React from "react";
import MarkdownRender from "@/components/MarkdownRender";

export default function MarkdownBlock({ data = {} }) {
  const content = data.content || "Add custom markdown text or HTML here.";

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 font-sans text-slate-200 leading-relaxed border border-white/10 shadow-xl">
      <MarkdownRender content={content} source={content} />
    </div>
  );
}
