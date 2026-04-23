export default function TickerBar({ items }) {
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
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-white font-bold tracking-[0.12em] uppercase"
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
        <div
          className="flex-1 overflow-hidden py-2"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div className="inline-flex gap-12 whitespace-nowrap ticker-scroll-anim pl-6">
            {doubled.map((item, i) => (
              <span key={i} className="text-text-secondary">
                <span className="text-accent-cyan font-semibold mr-2.5">
                  {(item.category || "NEWS").toUpperCase()}
                </span>
                {item.title}
                <span className="text-text-muted mx-3">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
