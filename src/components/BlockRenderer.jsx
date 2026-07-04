"use client";
import React from "react";
import HeroBlock from "@/components/blocks/HeroBlock";
import FeaturesBlock from "@/components/blocks/FeaturesBlock";
import CtaBlock from "@/components/blocks/CtaBlock";
import TestimonialsBlock from "@/components/blocks/TestimonialsBlock";
import FaqBlock from "@/components/blocks/FaqBlock";
import GalleryBlock from "@/components/blocks/GalleryBlock";
import MarkdownBlock from "@/components/blocks/MarkdownBlock";
import PricingBlock from "@/components/blocks/PricingBlock";
import StatsBlock from "@/components/blocks/StatsBlock";
import LogoCloudBlock from "@/components/blocks/LogoCloudBlock";
import FormBlock from "@/components/blocks/FormBlock";

export default function BlockRenderer({ block, blocks, pageStyle = {} }) {
  const blockList = blocks ? blocks : block ? [block] : [];
  if (!blockList || blockList.length === 0) return null;

  const pageFontClass =
    pageStyle.fontStyle === "serif"
      ? "font-serif"
      : pageStyle.fontStyle === "mono"
      ? "font-mono"
      : pageStyle.fontStyle === "display"
      ? "font-extrabold tracking-tight"
      : "font-sans";

  const pageFontSizeClass =
    pageStyle.fontSize === "sm"
      ? "text-sm"
      : pageStyle.fontSize === "lg"
      ? "text-lg"
      : pageStyle.fontSize === "xl"
      ? "text-xl"
      : "text-base";

  const pageSpacingClass =
    pageStyle.spacing === "compact"
      ? "space-y-6 py-2"
      : pageStyle.spacing === "spacious"
      ? "space-y-16 py-8"
      : pageStyle.spacing === "hero"
      ? "space-y-24 py-12"
      : "space-y-10 py-4";

  const containerStyle = {};
  if (pageStyle.bgColor) containerStyle.backgroundColor = pageStyle.bgColor;
  if (pageStyle.textColor) containerStyle.color = pageStyle.textColor;

  return (
    <div
      className={`rounded-3xl transition-all duration-300 ${pageFontClass} ${pageFontSizeClass} ${pageSpacingClass} selection:bg-indigo-500/30 selection:text-indigo-200`}
      style={containerStyle}
    >
      {pageStyle.customCss && (
        <style dangerouslySetInnerHTML={{ __html: pageStyle.customCss }} />
      )}

      {blockList.map((bItem, idx) => {
        const key = bItem.id || idx;
        const data = bItem.data || {};
        const style = data.style || {};

        const fontStyleClass =
          style.fontStyle === "serif"
            ? "font-serif"
            : style.fontStyle === "mono"
            ? "font-mono"
            : style.fontStyle === "display"
            ? "font-extrabold tracking-tight"
            : "";

        const fontSizeClass =
          style.fontSize === "sm"
            ? "text-sm"
            : style.fontSize === "lg"
            ? "text-lg"
            : style.fontSize === "xl"
            ? "text-xl"
            : "";

        const spacingClass =
          style.spacing === "compact"
            ? "py-4 px-3"
            : style.spacing === "spacious"
            ? "py-16 px-6"
            : style.spacing === "hero"
            ? "py-24 px-8"
            : "py-8 px-4";

        const blockInlineStyle = {};
        if (style.bgColor) blockInlineStyle.backgroundColor = style.bgColor;
        if (style.textColor) blockInlineStyle.color = style.textColor;

        let content = null;
        switch (bItem.type) {
          case "hero":
            content = <HeroBlock data={data} />;
            break;
          case "features":
            content = <FeaturesBlock data={data} />;
            break;
          case "cta":
            content = <CtaBlock data={data} />;
            break;
          case "testimonials":
            content = <TestimonialsBlock data={data} />;
            break;
          case "faq":
            content = <FaqBlock data={data} />;
            break;
          case "gallery":
            content = <GalleryBlock data={data} />;
            break;
          case "markdown":
            content = <MarkdownBlock data={data} />;
            break;
          case "pricing":
            content = <PricingBlock data={data} />;
            break;
          case "stats":
            content = <StatsBlock data={data} />;
            break;
          case "logocloud":
            content = <LogoCloudBlock data={data} />;
            break;
          case "form":
            content = <FormBlock data={data} />;
            break;
          default:
            content = null;
        }

        if (!content) return null;

        return (
          <div
            key={key}
            className={`rounded-2xl transition-all duration-200 ${fontStyleClass} ${fontSizeClass} ${spacingClass}`}
            style={blockInlineStyle}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

