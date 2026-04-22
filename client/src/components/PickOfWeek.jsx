import { useState, useEffect } from "react";

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
  const targetPercentage = numericScore ? (numericScore / 10) * 100 : 0;
  const prosList = pros ?? [];
  const consList = cons ?? [];

  const [displayScore, setDisplayScore] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!numericScore) return;
    const duration = 1400;
    const steps = 60;
    const stepVal = numericScore / steps;
    const stepPct = targetPercentage / steps;
    let current = 0;
    let pct = 0;
    const timer = setInterval(() => {
      current += stepVal;
      pct += stepPct;
      if (current >= numericScore) {
        setDisplayScore(numericScore);
        setBarWidth(targetPercentage);
        clearInterval(timer);
      } else {
        setDisplayScore(parseFloat(current.toFixed(1)));
        setBarWidth(parseFloat(pct.toFixed(1)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numericScore, targetPercentage]);

  return (
    <div className="relative bg-gradient-to-br from-[#1a0a2e] via-bg-card to-[#0d1a2e] border border-accent-purple rounded-xl p-6 shadow-[0_0_40px_rgba(124,58,237,0.25)] overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-start gap-6">
        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-display tracking-widest text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/30 rounded px-3 py-1">
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

          <h2 className="text-3xl font-black text-text-primary mb-3 leading-tight group-hover:text-accent-cyan">
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
        <div className="flex flex-col items-center justify-center bg-bg-primary/80 rounded-xl p-6 min-w-[140px] border border-border-dark shadow-inner">
          <div className="text-6xl font-black font-display text-accent-cyan leading-none tabular-nums">
            {displayScore % 1 === 0 ? displayScore : displayScore.toFixed(1)}
          </div>
          <div className="text-text-muted text-sm mt-1 font-display tracking-wider">
            / 10
          </div>
          <div className="w-full mt-4 bg-border-dark rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full"
              style={{
                width: `${barWidth}%`,
                transition: "width 0.05s linear",
              }}
            />
          </div>
          <p className="text-xs text-text-muted mt-2 font-display tracking-widest">
            SCORE
          </p>
        </div>
      </div>
    </div>
  );
}
