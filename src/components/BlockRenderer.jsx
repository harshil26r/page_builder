"use client";
import React from "react";
import { getBlockStyle } from "@/hooks/useBlockStyle";
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

const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  features: FeaturesBlock,
  cta: CtaBlock,
  testimonials: TestimonialsBlock,
  faq: FaqBlock,
  gallery: GalleryBlock,
  markdown: MarkdownBlock,
  pricing: PricingBlock,
  stats: StatsBlock,
  logocloud: LogoCloudBlock,
  form: FormBlock,
};

export default function BlockRenderer({ block, blocks, pageStyle = {} }) {
  const blockList = blocks ? blocks : block ? [block] : [];
  if (!blockList || blockList.length === 0) return null;

  // ponytail: pure utility function call compliant with React rules of hooks
  const pageStyleProps = getBlockStyle(pageStyle, true);

  return (
    <div
      className={`rounded-3xl transition-all duration-300 ${pageStyleProps.className} selection:bg-indigo-500/30 selection:text-indigo-200`}
      style={pageStyleProps.inlineStyle}
    >
      {pageStyle.customCss && (
        <style dangerouslySetInnerHTML={{ __html: pageStyle.customCss }} />
      )}

      {blockList.map((bItem, idx) => {
        const key = bItem.id || idx;
        const data = bItem.data || {};
        const style = data.style || {};

        // ponytail: getBlockStyle utility function call inside loop
        const blockStyleProps = getBlockStyle(style, false);
        const BlockComponent = BLOCK_COMPONENTS[bItem.type];

        if (!BlockComponent) return null;

        return (
          <div
            key={key}
            className={`rounded-2xl transition-all duration-200 ${blockStyleProps.className}`}
            style={blockStyleProps.inlineStyle}
          >
            <BlockComponent data={data} style={style} />
          </div>
        );
      })}
    </div>
  );
}
