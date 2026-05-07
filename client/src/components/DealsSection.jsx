import { useState } from "react";

const STORE_DOT = {
  Steam:     "#1b9fe8",
  Epic:      "#9ca3af",
  "PS Store":"#3b82f6",
  DEFAULT:   "#7c3aed",
};

const COVER_BG = {
  Steam:     "linear-gradient(135deg, rgba(27,159,232,0.3), rgba(124,58,237,0.2))",
  Epic:      "linear-gradient(135deg, rgba(156,163,175,0.3), rgba(124,58,237,0.2))",
  "PS Store":"linear-gradient(135deg, rgba(59,130,246,0.3), rgba(124,58,237,0.2))",
  DEFAULT:   "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))",
};

const VISIBLE_DEFAULT = 5;

function DealCard({ store, game, originalPrice, discountPrice, discount, url, image }) {
  const dotColor  = STORE_DOT[store]  || STORE_DOT.DEFAULT;
  const coverBg   = COVER_BG[store]   || COVER_BG.DEFAULT;
  const Wrapper   = url ? "a" : "div";
  const wrapperProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};
  const discountNum = parseInt((discount || "").replace(/[^0-9]/g, ""), 10) || 0;
  const isFree = (
    discountPrice === "$0" ||
    discountPrice === "$0.00" ||
    discountPrice?.toLowerCase() === "gratis" ||
    discountPrice === "0"
  );

  return (
    <Wrapper
      {...wrapperProps}
      className={`relative flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] transition-all duration-300 group${url ? " cursor-pointer" : ""}`}
      style={{ background: "rgba(26,26,46,0.6)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)";
        e.currentTarget.style.transform   = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.transform   = "";
      }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(180deg, #06b6d4, transparent)" }}
      />

      {/* Cover */}
      {image ? (
        <img
          src={image} alt={game} loading="lazy"
          className="w-14 h-14 rounded-lg flex-shrink-0 object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div
          className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center font-mono-jet text-[9px] text-white/30 uppercase tracking-widest text-center leading-tight"
          style={{ background: coverBg }}
        >
          COVER<br />ART
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-mono-jet text-[11px] text-text-muted flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
          {store}
        </div>
        <p className="font-grotesk font-semibold text-sm text-text-primary truncate">{game}</p>
        <div className="flex items-center gap-2 mt-1">
          {!isFree && (
            <span className="font-mono-jet text-xs text-text-muted line-through">{originalPrice}</span>
          )}
          {isFree ? (
            <span className="font-archivo text-sm text-success tracking-wide">GRATIS</span>
          ) : (
            <span className="font-archivo text-base text-accent-cyan">{discountPrice}</span>
          )}
        </div>
      </div>

      {/* Discount badge */}
      <div className="text-right flex-shrink-0">
        <div className="font-archivo text-lg text-success" style={{ textShadow: "0 0 12px rgba(52,211,153,0.5)" }}>
          -{isFree ? "100" : discountNum}%
        </div>
        <span className="font-mono-jet text-[10px] text-text-muted">{originalPrice}</span>
      </div>
    </Wrapper>
  );
}

export default function DealsSection({ deals }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore  = deals.length > VISIBLE_DEFAULT;
  const visible  = expanded ? deals : deals.slice(0, VISIBLE_DEFAULT);
  const hidden   = deals.length - VISIBLE_DEFAULT;

  return (
    <div className="flex flex-col gap-3">
      {visible.map((deal, i) => (
        <DealCard key={i} {...deal} />
      ))}

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full py-2.5 rounded-xl border border-white/[0.08] font-mono-jet text-[11px] text-text-muted hover:border-accent-cyan/40 hover:text-accent-cyan transition-all duration-200 flex items-center justify-center gap-2"
          style={{ background: "rgba(26,26,46,0.4)" }}
        >
          {expanded ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Mostrar menos
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Ver {hidden} oferta{hidden !== 1 ? "s" : ""} más
            </>
          )}
        </button>
      )}
    </div>
  );
}
