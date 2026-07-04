"use client";
import React from "react";
import MarkdownRender from "@/components/MarkdownRender";

export default function MarkdownBlock({ data = {} }) {
  const content = data.content || "Add custom markdown text or HTML here.";

  return (
    <div className="py-4 font-sans text-slate-200 leading-relaxed">
      <MarkdownRender content={content} source={content} />
    </div>
  );
}
