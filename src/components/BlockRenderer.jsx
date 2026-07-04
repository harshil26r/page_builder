"use client";
import React from "react";
import HeroBlock from "@/components/blocks/HeroBlock";
import FeaturesBlock from "@/components/blocks/FeaturesBlock";
import CtaBlock from "@/components/blocks/CtaBlock";
import TestimonialsBlock from "@/components/blocks/TestimonialsBlock";
import FaqBlock from "@/components/blocks/FaqBlock";
import GalleryBlock from "@/components/blocks/GalleryBlock";
import MarkdownBlock from "@/components/blocks/MarkdownBlock";

export default function BlockRenderer({ blocks = [] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-12 sm:space-y-16 py-4 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {blocks.map((block, idx) => {
        const key = block.id || idx;
        const data = block.data || {};

        switch (block.type) {
          case "hero":
            return <HeroBlock key={key} data={data} />;
          case "features":
            return <FeaturesBlock key={key} data={data} />;
          case "cta":
            return <CtaBlock key={key} data={data} />;
          case "testimonials":
            return <TestimonialsBlock key={key} data={data} />;
          case "faq":
            return <FaqBlock key={key} data={data} />;
          case "gallery":
            return <GalleryBlock key={key} data={data} />;
          case "markdown":
            return <MarkdownBlock key={key} data={data} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
