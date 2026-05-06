import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LIMIT = 8;

const CATEGORY_COLORS = {
  LANZAMIENTO: "#7c3aed",
  EXPANSION: "#06b6d4",
  INDUSTRIA: "#f59e0b",
  ACTUALIZACION: "#34d399",
  DEFAULT: "#ec4899",
};

function OlderCard({ item, index }) {
  const navigate = useNavigate();
  const accentColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.DEFAULT;

  return (
    <article
      onClick={() => navigate(`/news/${item.newsletterId}/${item.newsIndex}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/news/${item.newsletterId}/${item.newsIndex}`);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Leer: ${item.title}`}
      className="relative flex gap-4 p-4 rounded-xl border border-white/[0.07] cursor-pointer opacity-0 animate-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
      style={{
        background: "linear-gradient(180deg, rgba(26,26,46,0.7), rgba(21,21,42,0.5))",
        animationDelay: `${(index % LIMIT) * 0.05}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}50`;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 12px 32px -8px rgba(0,0,0,0.5), 0 0 20px -8px ${accentColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Thumbnail */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div
          className="w-20 h-20 rounded-lg flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${accentColor}25, rgba(6,182,212,0.15))`,
          }}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-mono-jet text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border"
            style={{ color: accentColor, borderColor: `${accentColor}35`, background: `${accentColor}10` }}
          >
            {item.category}
          </span>
          <span
            className="font-mono-jet text-[9px] text-text-muted border border-white/10 rounded px-2 py-0.5"
            style={{ background: "rgba(124,58,237,0.08)" }}
          >
            ED #{item.edition}
          </span>
        </div>

        <h4 className="font-grotesk font-bold text-sm text-text-primary leading-snug line-clamp-2">
          {item.title}
        </h4>

        <p className="font-mono-jet text-[10px] text-text-muted line-clamp-1">
          {item.platform}
        </p>
      </div>

      {/* Arrow */}
      <span className="flex-shrink-0 self-center font-mono-jet text-xs text-text-muted/40 group-hover:text-accent-purple">
        &#8594;
      </span>
    </article>
  );
}

export default function OlderNews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    api
      .get(`/news/feed?page=1&limit=${LIMIT}`)
      .then((res) => {
        setItems(res.data.items || []);
        setHasMore(res.data.hasMore || false);
        setEmpty((res.data.items || []).length === 0);
        setPage(2);
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await api.get(`/news/feed?page=${page}&limit=${LIMIT}`);
      setItems((prev) => [...prev, ...(res.data.items || [])]);
      setHasMore(res.data.hasMore || false);
      setPage((p) => p + 1);
    } catch {
      // silently fail
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return (
      <section id="section-older">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1.5 h-7 rounded-sm bg-text-muted/30" />
          <div className="h-6 w-48 bg-bg-card rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-bg-card animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      </section>
    );
  }

  if (empty) return null;

  return (
    <section id="section-older">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5">
          <span
            className="w-1.5 h-7 rounded-sm inline-block"
            style={{ background: "rgba(107,114,128,0.6)" }}
          />
          Noticias anteriores
          <span className="font-mono-jet text-[11px] text-text-muted font-normal">
            / ediciones pasadas
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {items.map((item, i) => (
          <OlderCard key={`${item.newsletterId}-${item.newsIndex}`} item={item} index={i} />
        ))}
      </div>

      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {[0, 1].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-bg-card animate-pulse" />
          ))}
        </div>
      )}

      {hasMore && !loadingMore ? (
        <button
          onClick={loadMore}
          className="w-full py-3.5 rounded-xl border border-white/[0.08] font-mono-jet text-[12px] text-text-muted hover:border-accent-purple/40 hover:text-accent-purple transition-all duration-200"
          style={{ background: "rgba(26,26,46,0.4)" }}
        >
          Cargar m&#225;s noticias &#8595;
        </button>
      ) : !hasMore && items.length > 0 ? (
        <div className="text-center font-mono-jet text-[11px] text-text-muted py-4 border-t border-white/[0.06]">
          &#8212; Has llegado al principio del archivo &#8212;
        </div>
      ) : null}
    </section>
  );
}
