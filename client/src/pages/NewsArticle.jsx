import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const CATEGORY_COLORS = {
  LANZAMIENTO: "bg-accent-purple text-white",
  EXPANSIÓN: "bg-accent-cyan text-black",
  INDUSTRIA: "bg-accent-yellow text-black",
  ACTUALIZACIÓN: "bg-success text-black",
  DEFAULT: "bg-accent-pink text-white",
};

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function NewsArticle() {
  const { newsletterId, newsIndex } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/news/${newsletterId}`)
      .then((res) => {
        const content = res.data.content;
        const item = content.news?.[Number(newsIndex)];
        setNews(item || null);
      })
      .catch(() => setNews(null))
      .finally(() => setLoading(false));
  }, [newsletterId, newsIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-danger">Noticia no encontrada</p>
      </div>
    );
  }

  const badgeClass = CATEGORY_COLORS[news.category] || CATEGORY_COLORS.DEFAULT;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-text-muted hover:text-text-primary transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna principal — artículo */}
          <article className="flex-1 min-w-0">
            {/* Imagen hero */}
            {news.image && (
              <div className="relative h-72 rounded-2xl overflow-hidden mb-6">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.parentElement.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
              </div>
            )}

            {/* Categoría + plataforma */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className={`text-xs font-bold px-3 py-1 rounded ${badgeClass}`}
              >
                {news.category}
              </span>
              <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1">
                {news.platform}
              </span>
              {news.source && (
                <span className="text-xs text-text-muted">
                  Fuente:{" "}
                  <span className="text-text-secondary">{news.source}</span>
                </span>
              )}
            </div>

            {/* Titular */}
            <h1 className="text-3xl font-black text-text-primary leading-tight mb-4">
              {news.title}
            </h1>

            {/* Bajada / entradilla */}
            <p className="text-lg text-accent-cyan font-medium leading-relaxed mb-6 border-l-2 border-accent-purple pl-4">
              {news.description}
            </p>

            {/* Cuerpo completo */}
            {news.fullDescription && (
              <div className="prose prose-invert max-w-none">
                {news.fullDescription
                  .split("\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <p
                      key={i}
                      className="text-text-secondary leading-relaxed mb-4 text-base"
                    >
                      {p}
                    </p>
                  ))}
              </div>
            )}

            {/* Links externos */}
            {(news.url || news.reviewLinks?.length > 0) && (
              <div className="mt-8 p-4 bg-bg-card border border-border-dark rounded-xl flex flex-col gap-3">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Links relacionados
                </p>
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent-cyan hover:underline"
                  >
                    📰 Fuente original — {news.source || news.url}
                  </a>
                )}
                {news.reviewLinks?.map((rl, i) => (
                  <a
                    key={i}
                    href={rl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent-purple hover:underline"
                  >
                    🎮 Review: {rl.label || rl.url}
                  </a>
                ))}
              </div>
            )}

            {/* Share */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: news.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copiado");
                }
              }}
              className="mt-6 text-xs border border-border-dark text-text-muted rounded px-4 py-2 hover:border-accent-purple hover:text-accent-purple transition-colors"
            >
              Compartir esta noticia ↗
            </button>
          </article>

          {/* Columna lateral — juego */}
          <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
            {news && (
              <button
                onClick={() => {
                  const slug = slugify(news.title);
                  navigate(`/game/${slug}`, {
                    state: {
                      title: news.title,
                      image: news.image,
                      platform: news.platform,
                    },
                  });
                }}
                className="w-full text-left bg-bg-card border border-border-dark rounded-xl overflow-hidden hover:border-accent-purple transition-colors group"
              >
                {news.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-1">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                    Juego
                  </p>
                  <p className="text-base font-bold text-text-primary leading-snug">
                    {news.title}
                  </p>
                  {news.platform && (
                    <p className="text-xs text-text-muted">{news.platform}</p>
                  )}
                  <p className="text-xs text-accent-purple mt-2 group-hover:underline">
                    Ver reviews del juego →
                  </p>
                </div>
              </button>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
