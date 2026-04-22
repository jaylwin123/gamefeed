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

  const isFree =
    discountPrice === "$0" ||
    discountPrice === "$0.00" ||
    discountPrice?.toLowerCase() === "gratis" ||
    discountPrice === "0";

  const discountNum =
    parseInt((discount || "").replace(/[^0-9]/g, ""), 10) || 0;

  return (
    <Wrapper
      {...wrapperProps}
      className={`bg-bg-card border border-border-dark rounded-xl p-4 flex flex-col gap-3 hover:border-accent-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-0.5 transition-all duration-300${url ? " cursor-pointer" : ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap ${storeClass}`}
        >
          {store}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary truncate">{game}</p>
          <div className="flex items-center gap-2 mt-1">
            {!isFree && (
              <span className="text-sm text-text-muted line-through">
                {originalPrice}
              </span>
            )}
            {isFree ? (
              <span className="text-base font-black text-success tracking-wide">
                GRATIS
              </span>
            ) : (
              <span className="text-lg font-bold text-accent-cyan">
                {discountPrice}
              </span>
            )}
          </div>
        </div>
        <span
          className={`text-sm font-bold border rounded px-2 py-1 whitespace-nowrap ${
            isFree
              ? "text-success bg-success/10 border-success/30"
              : "text-success bg-success/10 border-success/30"
          }`}
        >
          {isFree ? "100%" : discount}
        </span>
      </div>
      {discountNum > 0 && (
        <div className="h-1 bg-border-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-cyan to-success rounded-full"
            style={{
              width: `${Math.min(discountNum, 100)}%`,
              transition: "width 0.8s ease-out",
            }}
          />
        </div>
      )}
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
