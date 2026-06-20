"use client";
import React from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="w-full border border-gray-800 rounded-xl overflow-hidden bg-gray-950 shadow-inner" data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={onChange}
        preview="live"
        height={450}
        textareaProps={{
          placeholder: "Type Markdown or HTML here. Supports inline SVG tags, images, custom classes, links, tables, and more...",
        }}
        className="w-full text-sm font-sans"
      />
    </div>
  );
}
