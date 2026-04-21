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

export default function NewsCard({
  category,
  title,
  description,
  platform,
  image,
}) {
  const badgeClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.DEFAULT;
  const gradientClass =
    CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.DEFAULT;

  return (
    <div className="bg-bg-card border border-border-dark rounded-xl overflow-hidden flex flex-col hover:border-accent-purple hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 cursor-pointer group">
      {/* Imagen */}
      {image ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.parentElement.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
        </div>
      ) : (
        <div
          className={`h-24 bg-gradient-to-br ${gradientClass} border-b border-border-dark flex items-center justify-center`}
        >
          <span className="text-4xl opacity-30">🎮</span>
        </div>
      )}

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded ${badgeClass}`}>
            {category}
          </span>
          <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1">
            {platform}
          </span>
        </div>
        <h3 className="text-base font-bold text-text-primary group-hover:text-accent-cyan transition-colors leading-snug">
          {title}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
