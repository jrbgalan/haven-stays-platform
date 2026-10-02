import { useEffect } from "react";

/** Sets document title and meta description for a page, restoring on unmount. */
export function useSeo(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} · Haven`;
    let meta = document.querySelector('meta[name="description"]');
    const hadMeta = !!meta;
    const prevDesc = meta?.getAttribute("content") || "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description || "");
    return () => {
      document.title = prevTitle;
      if (hadMeta) meta.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}