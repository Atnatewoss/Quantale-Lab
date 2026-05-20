import { defineDocs } from "@farming-labs/docs";
import { pixelBorder } from "@farming-labs/theme/pixel-border";
import React from "react";

export default defineDocs({
  entry: "docs",
  theme: pixelBorder(),
  ordering: "numeric",
  metadata: {
    titleTemplate: "%s – Quantale Chess Arena Docs",
  },
  icons: {
    BookOpen: React.createElement("span", { key: "bookopen", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' } }),
    Binary: React.createElement("span", { key: "binary", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-binary"><rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2v6"/><path d="M14 4h2v6"/></svg>' } }),
    Award: React.createElement("span", { key: "award", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>' } }),
    Swords: React.createElement("span", { key: "swords", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="9.5 17.5 21 6 21 3 18 3 6.5 14.5"/><line x1="11" y1="19" x2="5" y2="13"/><line x1="8" y1="16" x2="4" y2="20"/><line x1="5" y1="21" x2="3" y2="19"/></svg>' } }),
    Search: React.createElement("span", { key: "search", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' } }),
    ShieldCheck: React.createElement("span", { key: "shieldcheck", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>' } }),
    Code: React.createElement("span", { key: "code", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' } }),
    Play: React.createElement("span", { key: "play", dangerouslySetInnerHTML: { __html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>' } }),
  },
});
