import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CIRCUMFERENCE = 2 * Math.PI * 54;

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
    slug,
    quote,
    quoteAuthor,
    image,
  } = pick;

  const navigate = useNavigate();
  const ringRef = useRef(null);
  const sectionRef = useRef(null);

  const platformList = platforms ?? (platform ? [platform] : []);
  const bodyText = description ?? reason ?? "";
  const numericScore = score ?? (rating ? parseFloat(rating) : null);
  const targetPct = numericScore ? Math.min((numericScore / 10) * 100, 100) : 0;
  const prosList = pros ?? [];
  const consList = cons ?? [];

  const [displayScore, setDisplayScore] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          const duration = 1500;
          const steps = 60;
          const stepVal = (numericScore || 0) / steps;
          let cur = 0;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            cur += stepVal;
            if (step >= steps) {
              setDisplayScore(numericScore);
              clearInterval(timer);
            } else {
              setDisplayScore(parseFloat(cur.toFixed(1)));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [numericScore, animated]);

  const dashOffset = animated
    ? CIRCUMFERENCE * (1 - targetPct / 100)
    : CIRCUMFERENCE;

  const stats = [
    { label: "PLATAFORMAS", val: platformList.join(", ") || "—" },
    { label: "PROS", val: prosList.length ? `${prosList.length} puntos` : "—" },
    {
      label: "CONTRAS",
      val: consList.length ? `${consList.length} puntos` : "—",
    },
    { label: "SCORE", val: numericScore ? `${numericScore}/10` : "—" },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative rounded-[18px] border border-white/[0.08] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(26,10,46,0.95), rgba(13,26,46,0.9))",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #f59e0b 40%, #ec4899 70%, transparent 100%)",
        }}
      />
      {/* Bg glows */}
      <div
        className="absolute -top-20 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col md:flex-row gap-0">
        {/* Left — pick media placeholder */}
        <div
          className="md:w-56 min-h-[200px] md:min-h-0 flex-shrink-0 flex flex-col items-center justify-center gap-4 p-8"
          style={{
            background:
              "linear-gradient(180deg, rgba(245,158,11,0.18), rgba(236,72,153,0.12))",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="font-archivo text-[11px] tracking-[0.3em] uppercase text-accent-yellow/80 mb-2">
            ★ GOLD PICK
          </div>
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-24 h-24 rounded-xl object-cover border border-accent-yellow/20"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-xl flex items-center justify-center border border-accent-yellow/20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(236,72,153,0.18))",
              }}
            >
              <span className="font-display text-4xl text-accent-yellow/40">
                ★
              </span>
            </div>
          )}
          <div className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest text-center">
            GAME COVER
            <br />
            ART PENDING
          </div>
        </div>

        {/* Center — info */}
        <div className="flex-1 p-7 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-archivo text-[11px] tracking-[0.25em] text-accent-yellow bg-accent-yellow/10 border border-accent-yellow/30 rounded-full px-3.5 py-1">
              PICK OF THE WEEK
            </span>
            {platformList.map((p, i) => (
              <span
                key={i}
                className="font-mono-jet text-[11px] text-text-muted border border-white/10 rounded px-2.5 py-1"
              >
                {p}
              </span>
            ))}
          </div>

          <h2 className="font-archivo text-[clamp(24px,4vw,42px)] leading-tight text-text-primary">
            {title}
          </h2>

          <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
            {bodyText}
          </p>

          {(quote || prosList.length > 0) && (
            <blockquote className="border-l-2 border-accent-yellow/50 pl-4 py-1">
              <p className="font-grotesk text-base text-text-primary/80 italic">
                "{quote || prosList[0]}"
              </p>
              <cite className="font-mono-jet text-[11px] text-text-muted block mt-1.5">
                — {quoteAuthor || "Redacción GAMEFEED"}
              </cite>
            </blockquote>
          )}

          {/* Stats table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(({ label, val }) => (
              <div
                key={label}
                className="rounded-lg p-3 border border-white/[0.06]"
                style={{ background: "rgba(0,0,0,0.25)" }}
              >
                <div className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest mb-1">
                  {label}
                </div>
                <div className="font-grotesk font-semibold text-sm text-text-primary">
                  {val}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-auto">
            {slug && (
              <button
                onClick={() => navigate(`/games/${slug}`)}
                className="font-mono-jet text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-lg font-semibold transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #ec4899)",
                  color: "#0d0d0f",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(245,158,11,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Leer review completa →
              </button>
            )}
            <button
              className="font-mono-jet text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-lg border border-white/20 text-text-muted transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
                e.currentTarget.style.color = "#f59e0b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.color = "";
              }}
            >
              Ver trailer
            </button>
          </div>
        </div>

        {/* Right — SVG score ring */}
        {numericScore && (
          <div
            className="md:w-52 flex-shrink-0 flex flex-col items-center justify-center gap-3 p-8"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="font-mono-jet text-[10px] text-text-muted uppercase tracking-[0.2em] mb-2">
              SCORE
            </div>
            <div className="relative w-32 h-32">
              <svg
                width="128"
                height="128"
                viewBox="0 0 128 128"
                className="rotate-[-90deg]"
              >
                <defs>
                  <linearGradient
                    id="gold-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <circle
                  ref={ringRef}
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke="url(#gold-grad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition:
                      "stroke-dashoffset 1.5s cubic-bezier(.2,.8,.2,1)",
                    filter: "drop-shadow(0 0 8px rgba(245,158,11,0.6))",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-archivo text-3xl leading-none tabular-nums"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #ec4899)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {displayScore % 1 === 0
                    ? displayScore
                    : displayScore.toFixed(1)}
                </span>
                <span className="font-mono-jet text-[11px] text-text-muted mt-0.5">
                  / 10
                </span>
              </div>
            </div>
            <div className="font-archivo text-[11px] tracking-widest text-accent-yellow/70 uppercase">
              {numericScore >= 9
                ? "MASTERPIECE"
                : numericScore >= 8
                  ? "EXCELLENT"
                  : numericScore >= 7
                    ? "GREAT"
                    : "GOOD"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
