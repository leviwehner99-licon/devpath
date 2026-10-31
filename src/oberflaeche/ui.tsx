import type { ReactNode } from "react";

export type IconName = "today" | "learn" | "studio" | "base" | "diploma" | "library" | "curriculum" | "community" | "projects" | "settings" | "spark" | "search" | "arrow" | "external";

const glyphs: Record<IconName, ReactNode> = {
  today: <><rect x="3" y="4" width="18" height="17" rx="4"/><path d="M8 2v4m8-4v4M3 9h18m-13 5h3m-3 3h7"/></>,
  learn: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16M8 7h8m-8 4h8"/></>,
  studio: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-12-4 14"/></>,
  base: <><path d="M4 5h16M4 10h16M4 15h10M4 20h10"/><circle cx="18" cy="17" r="3"/><path d="M18 15v2l1.2.8"/></>,
  diploma: <><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></>,
  library: <><path d="M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h5"/><path d="M2 7v14h14"/></>,
  curriculum: <><circle cx="6" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="6" cy="19" r="2"/><path d="M11 5h9M11 12h9M11 19h9"/></>,
  community: <><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0m1-11a3 3 0 0 1 0 6m2 1a5 5 0 0 1 3 4"/></>,
  projects: <><path d="M3 7h7l2 2h9v10H3z"/><path d="M3 7V5h7l2 2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2M12 19.5v2M4.8 4.8l1.4 1.4m11.6 11.6 1.4 1.4M2.5 12h2m15 0h2M4.8 19.2l1.4-1.4M17.8 6.2l1.4-1.4"/><circle cx="12" cy="12" r="8"/></>,
  spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
  arrow: <><path d="M4 12h15m-6-6 6 6-6 6"/></>,
  external: <><path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
};

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{glyphs[name]}</svg>;
}

export function LogoMark({ size = 36 }: { size?: number }) {
  return <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true"><svg viewBox="0 0 44 44" fill="none"><path d="m16 12-9 10 9 10M28 12l9 10-9 10M25 9l-6 26" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>;
}
