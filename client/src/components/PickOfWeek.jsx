export default function PickOfWeek({ pick }) {
  const {
    title,
    platforms,
    platform,
    description,
    reason,
    score,
    rating,
    pros,
    cons,
  } = pick;

  const platformList = platforms ?? (platform ? [platform] : []);
  const bodyText = description ?? reason ?? "";
  const numericScore = score ?? (rating ? parseFloat(rating) : null);
  const percentage = numericScore ? (numericScore / 10) * 100 : 0;
  const prosList = pros ?? [];
  const consList = cons ?? [];

  return (
    <div className="bg-gradient-to-br from-bg-card via-[#1a1a2e] to-[#1a0a2e] border border-accent-purple rounded-xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/30 rounded px-2 py-1">
              PICK OF THE WEEK ⭐
            </span>
            {platformList.map((p, i) => (
              <span
                key={i}
                className="text-xs border border-border-dark text-text-muted rounded px-2 py-1"
              >
                {p}
              </span>
            ))}
          </div>

          <h2 className="text-3xl font-black text-text-primary mb-3 leading-tight">
            {title}
          </h2>
          <p className="text-text-secondary leading-relaxed mb-5">{bodyText}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-success mb-2 uppercase tracking-wider">
                Pros
              </p>
              <ul className="space-y-1.5">
                {prosList.map((pro, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-accent-yellow mb-2 uppercase tracking-wider">
                Contras
              </p>
              <ul className="space-y-1.5">
                {consList.map((con, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="text-accent-yellow mt-0.5 flex-shrink-0">
                      △
                    </span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center justify-center bg-bg-primary rounded-xl p-6 min-w-[130px] border border-border-dark">
          <div className="text-6xl font-black text-accent-cyan leading-none">
            {numericScore ?? "—"}
          </div>
          <div className="text-text-muted text-sm mt-1">/ 10</div>
          <div className="w-full mt-4 bg-border-dark rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-2">Score</p>
        </div>
      </div>
    </div>
  );
}
