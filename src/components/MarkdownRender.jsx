"use client";
import React from "react";
import dynamic from "next/dynamic";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  { ssr: false }
);

export default function MarkdownRender({ source, content }) {
  const markdownText = source !== undefined ? source : content || "";

  return (
    <div className="w-full" data-color-mode="dark">
      <MarkdownPreview
        source={markdownText}
        style={{
          backgroundColor: "transparent",
          color: "inherit",
          fontFamily: "inherit",
        }}
        className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
      />
    </div>
  );
}
