"use client";
import React from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function RichTextEditor({
  value = "",
  onChange,
  height = 350,
  preview = "live",
  placeholder = "Type Markdown or HTML here. Supports headings, bold/italic text, links, lists, tables, images, blockquotes, and code snippets...",
  className = "",
  disabled = false,
}) {
  return (
    <div
      className={`w-full border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-inner text-slate-100 ${className}`}
      data-color-mode="dark"
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange && onChange(val || "")}
        preview={preview}
        height={height}
        overflow={false}
        textareaProps={{
          placeholder,
          disabled,
        }}
        className="w-full text-sm font-sans rounded-2xl"
      />
    </div>
  );
}
