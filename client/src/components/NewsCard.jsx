const CATEGORY_COLORS = {
  LANZAMIENTO: "bg-accent-purple text-white",
  EXPANSIÓN: "bg-accent-cyan text-black",
  INDUSTRIA: "bg-accent-yellow text-black",
  ACTUALIZACIÓN: "bg-success text-black",
  DEFAULT: "bg-accent-pink text-white",
};

export default function NewsCard({ category, title, description, platform }) {
  const badgeClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.DEFAULT;

  return (
    <div className="bg-bg-card border border-border-dark rounded-xl p-5 flex flex-col gap-3 hover:border-accent-purple hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 cursor-pointer group">
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
  );
}
