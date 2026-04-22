import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  LANZAMIENTO: "bg-accent-purple text-white",
  EXPANSIÓN: "bg-accent-cyan text-black",
  INDUSTRIA: "bg-accent-yellow text-black",
  ACTUALIZACIÓN: "bg-success text-black",
  DEFAULT: "bg-accent-pink text-white",
};

const CATEGORY_GRADIENTS = {
  LANZAMIENTO: "from-accent-purple/20 to-transparent",
  EXPANSIÓN: "from-accent-cyan/20 to-transparent",
  INDUSTRIA: "from-accent-yellow/20 to-transparent",
  ACTUALIZACIÓN: "from-success/20 to-transparent",
  DEFAULT: "from-accent-pink/20 to-transparent",
};

const CATEGORY_BORDER = {
  LANZAMIENTO: "#7c3aed",
  EXPANSIÓN: "#06b6d4",
  INDUSTRIA: "#f59e0b",
  ACTUALIZACIÓN: "#34d399",
  DEFAULT: "#ec4899",
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
  const badgeClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.DEFAULT;
  const gradientClass =
    CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.DEFAULT;
  const borderColor = CATEGORY_BORDER[category] || CATEGORY_BORDER.DEFAULT;
  const readTime = estimateReadTime((body || "") + " " + (description || ""));

  return (
    <div
      onClick={() => navigate(`/news/${newsletterId}/${newsIndex}`)}
      style={{
        borderLeftColor: borderColor,
        animationDelay: `${index * 0.08}s`,
      }}
      className={`bg-bg-card border border-border-dark border-l-4 rounded-xl overflow-hidden flex flex-col hover:border-accent-purple hover:bg-bg-card-hover hover:shadow-[0_0_28px_rgba(124,58,237,0.35)] transition-all duration-300 cursor-pointer group opacity-0 animate-fade-up${featured || lastAlone ? " md:col-span-2" : ""}`}
    >
      {image ? (
        <div
          className={`relative overflow-hidden${featured ? " h-64" : " h-44"}`}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.parentElement.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/20 to-transparent" />
          {source && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-xs text-text-muted px-2 py-1 rounded font-mono border border-white/10">
              {source}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`bg-gradient-to-br ${gradientClass} border-b border-border-dark flex items-center justify-center${featured ? " h-40" : " h-24"}`}
        >
          <span className="text-4xl opacity-30">🎮</span>
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className={`text-xs font-bold px-2 py-1 rounded tracking-wider font-display text-sm ${badgeClass}`}
          >
            {category}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1">
              {platform}
            </span>
            <span className="text-xs text-text-muted font-mono opacity-60">
              {readTime} min
            </span>
          </div>
        </div>
        <h3
          className={`font-black text-text-primary group-hover:text-accent-cyan transition-colors leading-tight${featured ? " text-2xl" : " text-base"}`}
        >
          {title}
        </h3>
        {featured && lead && (
          <p className="text-sm text-accent-cyan/80 italic leading-relaxed border-l-2 border-accent-cyan/40 pl-3">
            {lead}
          </p>
        )}
        <p
          className={`text-sm text-text-secondary leading-relaxed${featured ? "" : " line-clamp-3"}`}
        >
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xs text-accent-purple font-semibold group-hover:text-accent-cyan transition-colors">
            Leer más →
          </span>
          {source && !image && (
            <span className="text-xs text-text-muted font-mono opacity-50">
              {source}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
