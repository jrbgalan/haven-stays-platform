import { useEffect } from "react";

export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
}

function setMetaTag(selector: string, attr: string, value: string): string | null {
  let element = document.querySelector(selector);
  const prevValue = element ? element.getAttribute(attr) : null;
  if (!element) {
    element = document.createElement("meta");
    const [nameOrProperty, attrVal] = selector.replace(/[\[\]'"]/g, "").split("=");
    element.setAttribute(nameOrProperty, attrVal);
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
  return prevValue;
}

/**
 * Sets document title, description, Open Graph and Twitter card tags, restoring previous values on unmount.
 */
export function useSeo(title: string, description?: string, image?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const fullTitle = title.includes("Haven") ? title : `${title} · Haven`;
    document.title = fullTitle;

    const desc = description || "A curated collection of extraordinary luxury stays, private villas, and bespoke experiences.";
    const img = image || "/og-image.svg";

    const prevDesc = setMetaTag('meta[name="description"]', "content", desc);
    const prevOgTitle = setMetaTag('meta[property="og:title"]', "content", fullTitle);
    const prevOgDesc = setMetaTag('meta[property="og:description"]', "content", desc);
    const prevOgImg = setMetaTag('meta[property="og:image"]', "content", img);
    const prevTwTitle = setMetaTag('meta[name="twitter:title"]', "content", fullTitle);
    const prevTwDesc = setMetaTag('meta[name="twitter:description"]', "content", desc);
    const prevTwImg = setMetaTag('meta[name="twitter:image"]', "content", img);

    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) setMetaTag('meta[name="description"]', "content", prevDesc);
      if (prevOgTitle !== null) setMetaTag('meta[property="og:title"]', "content", prevOgTitle);
      if (prevOgDesc !== null) setMetaTag('meta[property="og:description"]', "content", prevOgDesc);
      if (prevOgImg !== null) setMetaTag('meta[property="og:image"]', "content", prevOgImg);
      if (prevTwTitle !== null) setMetaTag('meta[name="twitter:title"]', "content", prevTwTitle);
      if (prevTwDesc !== null) setMetaTag('meta[name="twitter:description"]', "content", prevTwDesc);
      if (prevTwImg !== null) setMetaTag('meta[name="twitter:image"]', "content", prevTwImg);
    };
  }, [title, description, image]);
}