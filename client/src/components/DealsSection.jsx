const STORE_COLORS = {
  Steam: "bg-blue-600 text-white",
  Epic: "bg-gray-700 text-white",
  "PS Store": "bg-blue-800 text-white",
  DEFAULT: "bg-accent-purple text-white",
};

function DealCard({
  store,
  game,
  originalPrice,
  discountPrice,
  discount,
  url,
}) {
  const storeClass = STORE_COLORS[store] || STORE_COLORS.DEFAULT;
  const Wrapper = url ? "a" : "div";
  const wrapperProps = url
    ? { href: url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`bg-bg-card border border-border-dark rounded-xl p-4 flex items-center gap-4 hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300${url ? " cursor-pointer" : ""}`}
    >
      <div
        className={`text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap ${storeClass}`}
      >
        {store}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary truncate">{game}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-text-muted line-through">
            {originalPrice}
          </span>
          <span className="text-lg font-bold text-accent-cyan">
            {discountPrice}
          </span>
        </div>
      </div>
      <span className="text-sm font-bold text-success bg-success/10 border border-success/30 rounded px-2 py-1 whitespace-nowrap">
        -{discount}
      </span>
    </Wrapper>
  );
}

export default function DealsSection({ deals }) {
  return (
    <div className="flex flex-col gap-3">
      {deals.map((deal, i) => (
        <DealCard key={i} {...deal} />
      ))}
    </div>
  );
}
