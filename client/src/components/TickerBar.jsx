export default function TickerBar({ items }) {
  if (!items || items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="bg-accent-purple/8 border-b border-accent-purple/20 py-2 overflow-hidden flex items-center">
      <span className="bg-accent-purple text-white text-xs font-display tracking-widest px-3 py-1 whitespace-nowrap flex-shrink-0 z-10 mr-4">
        BREAKING
      </span>
      <div className="overflow-hidden flex-1">
        <div className="inline-flex animate-ticker whitespace-nowrap">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="text-xs text-text-secondary px-8 inline-block"
            >
              <span className="text-accent-cyan mr-2">▸</span>
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
