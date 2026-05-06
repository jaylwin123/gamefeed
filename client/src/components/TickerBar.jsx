import { useNavigate } from "react-router-dom";

const CATEGORY_COLOR = {
  LANZAMIENTO:   "#7c3aed",
  EXPANSION:     "#06b6d4",
  INDUSTRIA:     "#f59e0b",
  ACTUALIZACION: "#34d399",
  DEFAULT:       "#ec4899",
};

export default function TickerBar({ items, newsletterId }) {
  const navigate = useNavigate();
  if (!items || items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className="border-b border-white/[0.06] overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, rgba(236,72,153,0.08), rgba(124,58,237,0.06), rgba(6,182,212,0.08))",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center font-mono-jet text-xs">
        {/* BREAKING badge */}
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-white font-bold tracking-[0.12em] uppercase z-10"
          style={{
            background: "var(--accent-pink)",
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full bg-white dot-pulse"
            style={{ boxShadow: "0 0 10px white" }}
          />
          BREAKING
        </div>

        {/* Scrolling strip — pauses on hover */}
        <div
          className="flex-1 overflow-hidden py-2 group"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div
            className="inline-flex gap-12 whitespace-nowrap ticker-scroll-anim pl-6 group-hover:[animation-play-state:paused]"
          >
            {doubled.map((item, i) => {
              const newsIndex = i % items.length;
              const color = CATEGORY_COLOR[item.category] || CATEGORY_COLOR.DEFAULT;
              const isClickable = Boolean(newsletterId);

              return (
                <span
                  key={i}
                  onClick={
                    isClickable
                      ? () => navigate(`/news/${newsletterId}/${newsIndex}`)
                      : undefined
                  }
                  className={`text-text-secondary transition-colors${isClickable ? " cursor-pointer hover:text-text-primary" : ""}`}
                >
                  <span
                    className="font-semibold mr-2.5 transition-colors"
                    style={{ color }}
                  >
                    {(item.category || "NEWS").toUpperCase()}
                  </span>
                  {item.title}
                  <span className="text-text-muted/40 mx-3">&#9670;</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
