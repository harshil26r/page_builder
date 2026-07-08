import { FONT_STYLE_MAP, FONT_SIZE_MAP, SPACING_MAP, PAGE_SPACING_MAP } from "@/config/styleConfig";

// ponytail: pure style computation utility function safely callable inside loops & callbacks
export function getBlockStyle(style = {}, isPage = false) {
  const spacingMap = isPage ? PAGE_SPACING_MAP : SPACING_MAP;

  const fontClass = FONT_STYLE_MAP[style.fontStyle] || "";
  const sizeClass = FONT_SIZE_MAP[style.fontSize] || "";
  const spacingClass = spacingMap[style.spacing] || "";

  const className = [fontClass, sizeClass, spacingClass].filter(Boolean).join(" ");

  const inlineStyle = {
    ...(style.bgColor && { backgroundColor: style.bgColor }),
    ...(style.textColor && { color: style.textColor }),
  };

  return { className, inlineStyle };
}

export default function useBlockStyle(style = {}, isPage = false) {
  return getBlockStyle(style, isPage);
}
