﻿import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  LANZAMIENTO: { bg: "#7c3aed", text: "white", label: "pp" },
  EXPANSION:   { bg: "#06b6d4", text: "black", label: "cy" },
  INDUSTRIA:   { bg: "#f59e0b", text: "black", label: "yl" },
  ACTUALIZACION:{ bg: "#34d399", text: "black", label: "gn" },
  DEFAULT:     { bg: "#ec4899", text: "white", label: "pk" },
};

const BADGE_BORDER = {
  LANZAMIENTO: "rgba(124,58,237,0.3)",
  EXPANSION:   "rgba(6,182,212,0.3)",
  INDUSTRIA:   "rgba(245,158,11,0.3)",
  ACTUALIZACION:"rgba(52,211,153,0.3)",
  DEFAULT:     "rgba(236,72,153,0.3)",
};

function estimateReadTime(text) {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function NewsCard({
  category,
  title,
  description,
  platform,
  image,
  newsletterId,
  newsIndex,
  featured = false,
  lastAlone = false,
  index = 0,
  source,
  lead,
  body,
}) {
  const navigate = useNavigate();
  const cat = CATEGORY_COLORS[category] || CATEGORY_COLORS.DEFAULT;
  const readTime = estimateReadTime((body || "") + " " + (description || ""));
  const colSpan = featured || lastAlone ? "md:col-span-6" : "md:col-span-3";

  function handleKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/news/${newsletterId}/${newsIndex}`);
    }
  }

  return (
    <article
      onClick={() => navigate(`/news/${newsletterId}/${newsIndex}`)}
      onKeyDown={handleKey}
      tabIndex={0}
      role="button"
      aria-label={`Leer: ${title}`}
      className={`relative flex flex-col cursor-pointer rounded-[14px] overflow-hidden border border-white/[0.12] opacity-0 animate-fade-up transition-all duration-[220ms] ease-[cubic-bezier(.2,.8,.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${colSpan}`}
      style={{
        animationDelay: `${index * 0.08}s`,
        background: "linear-gradient(180deg, rgba(26,26,46,0.85), rgba(21,21,42,0.75))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "rgba(124,58,237,0.55)";
        e.currentTarget.style.boxShadow = "0 18px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.15), 0 0 32px -8px rgba(124,58,237,0.4)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-[14px] pointer-events-none z-[1]"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)" }} />

      {/* Media */}
      <div className={`relative overflow-hidden ${featured ? "aspect-[21/9]" : "aspect-video"}`}
        style={{ background: "linear-gradient(135deg, #1a1a2e, #0d0d0f)" }}>
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={e => { e.currentTarget.parentElement.style.display = "none"; }}
          />
        ) : (
          <div className="absolute inset-0" style={{
            background: `linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.18)), repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 14px)`
          }} />
        )}
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-[2]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 3px)", backgroundSize: "100% 3px" }} />
        {/* Overlay */}
        <div className="absolute inset-0 z-[3]"
          style={{ background: "linear-gradient(180deg, transparent 40%, rgba(13,13,15,0.95) 100%)" }} />
        {/* Category badge */}
        <span className="absolute top-3 left-3 z-[4] font-mono-jet text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-widest"
          style={{ color: cat.bg, borderColor: BADGE_BORDER[category] || BADGE_BORDER.DEFAULT, background: "rgba(13,13,15,0.7)" }}>
          {category}
        </span>
        {source && (
          <span className="absolute top-3 right-3 z-[4] font-mono-jet text-[10px] text-white/40 px-2 py-1 rounded border border-white/10"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            {source}
          </span>
        )}
        {!image && (
          <span className="absolute bottom-2.5 right-3 z-[4] font-mono-jet text-[10px] text-white/35 uppercase tracking-[0.15em]">
            {platform}
          </span>
        )}
      </div>

      {/* Body */}
      <div className={`relative z-[2] flex flex-col flex-1 gap-3 ${featured ? "p-7 md:p-8" : "p-5"}`}>
        <div className="font-mono-jet text-[11px] text-text-muted flex items-center gap-2 flex-wrap">
          <span>{source || "GAMEFEED"}</span>
          <span className="text-text-muted/40">/</span>
          <span>{platform}</span>
          <span className="text-text-muted/40">/</span>
          <span>{readTime} min</span>
        </div>
        <h3 className={`font-grotesk font-bold text-text-primary leading-tight ${featured ? "text-4xl max-w-[80%]" : "text-base"}`}>
          {title}
        </h3>
        {featured && lead && (
          <p className="text-accent-cyan/80 italic text-sm leading-relaxed border-l-2 border-accent-cyan/40 pl-3 max-w-[70%]">
            {lead}
          </p>
        )}
        <p className={`text-sm text-text-secondary leading-relaxed ${featured ? "line-clamp-3 max-w-[70%]" : "line-clamp-2"}`}>
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-mono-jet text-xs text-accent-purple group-hover:text-accent-cyan transition-colors">
            Leer ahora →
          </span>
        </div>
      </div>
    </article>
  );
}
