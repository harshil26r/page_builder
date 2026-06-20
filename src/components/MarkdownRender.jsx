"use client";
import React from "react";
import dynamic from "next/dynamic";

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  { ssr: false }
);

export default function MarkdownRender({ source }) {
  return (
    <div className="w-full" data-color-mode="dark">
      <MarkdownPreview
        source={source}
        style={{
          backgroundColor: "transparent",
          color: "inherit",
          fontFamily: "inherit",
        }}
        className="prose prose-invert max-w-none text-gray-300 md:text-lg leading-relaxed"
      />
    </div>
  );
}
