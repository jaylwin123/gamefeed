import { useEffect } from "react";

const CATEGORY_COLORS = {
  LANZAMIENTO: "bg-accent-purple text-white",
  EXPANSIÓN: "bg-accent-cyan text-black",
  INDUSTRIA: "bg-accent-yellow text-black",
  ACTUALIZACIÓN: "bg-success text-black",
  DEFAULT: "bg-accent-pink text-white",
};

export default function NewsModal({ news, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const {
    category,
    title,
    description,
    fullDescription,
    platform,
    image,
    url,
    source,
  } = news;
  const badgeClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.DEFAULT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-border-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(124,58,237,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen */}
        {image && (
          <div className="relative h-56 overflow-hidden rounded-t-2xl">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${badgeClass}`}
              >
                {category}
              </span>
              <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1">
                {platform}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Título */}
          <h2 className="text-xl font-black text-text-primary leading-snug">
            {title}
          </h2>

          {/* Descripción completa o resumen */}
          <p className="text-text-secondary leading-relaxed text-sm">
            {fullDescription || description}
          </p>

          {/* Fuente + link */}
          <div className="flex items-center justify-between pt-3 border-t border-border-dark flex-wrap gap-3">
            {source && (
              <span className="text-xs text-text-muted">
                Fuente: <span className="text-text-secondary">{source}</span>
              </span>
            )}
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-accent-cyan border border-accent-cyan/40 rounded px-4 py-2 hover:bg-accent-cyan/10 transition-colors ml-auto"
              >
                Leer noticia completa →
              </a>
            ) : (
              <span className="text-xs text-text-muted ml-auto italic">
                Sin enlace disponible
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
