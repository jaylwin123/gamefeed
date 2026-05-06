import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import SkeletonCard from "../components/SkeletonCard";
import DealsSection from "../components/DealsSection";
import PickOfWeek from "../components/PickOfWeek";
import PollSection from "../components/PollSection";
import ScrollProgressBar from "../components/ScrollProgressBar";
import TickerBar from "../components/TickerBar";
import Footer from "../components/Footer";
import OlderNews from "../components/OlderNews";
import BackToTop from "../components/BackToTop";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ─── Platform buckets ────────────────────────────────────────────────────────
const PLATFORM_BUCKETS = [
  { key: "PC", match: "pc" },
  { key: "PS5", match: "ps5" },
  { key: "PS4", match: "ps4" },
  { key: "Xbox", match: "xbox" },
  { key: "Switch", match: "switch" },
  { key: "Móvil", match: "mobil" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function estimateTotalReadTime(news) {
  const words = news.reduce((acc, n) => {
    const text = [(n.body || ""), (n.lead || ""), (n.description || "")].join(" ");
    return acc + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

// ─── Inline components ───────────────────────────────────────────────────────
function SectionDivider({ label = "// SECTION" }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="w-2.5 h-2.5 flex-shrink-0 rotate-45 bg-accent-purple" style={{ boxShadow: "0 0 10px #7c3aed" }} />
      <span className="font-mono-jet text-[11px] text-text-muted tracking-widest uppercase flex-shrink-0">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-accent-purple/30 to-transparent" />
    </div>
  );
}

function SectionNav() {
  const sections = [
    { id: "section-news",   label: "Noticias",   color: "#7c3aed" },
    { id: "section-deals",  label: "Ofertas",    color: "#06b6d4" },
    { id: "section-poll",   label: "Encuesta",   color: "#ec4899" },
    { id: "section-pick",   label: "Pick",       color: "#f59e0b" },
    { id: "section-older",  label: "Anteriores", color: "#6b7280" },
  ];
  return (
    <nav className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <span className="font-mono-jet text-[10px] text-text-muted/50 uppercase tracking-widest flex-shrink-0 mr-1">IR A</span>
      {sections.map(({ id, label, color }) => (
        <button
          key={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="flex-shrink-0 font-mono-jet text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-150"
          style={{ borderColor: `${color}35`, color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${color}35`; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

function EditionStats({ news, deals, readTime }) {
  const platforms = new Set(
    news.flatMap((n) => (n.platform || "").split("/").map((p) => p.trim()).filter(Boolean))
  );
  const stats = [
    { label: "NOTICIAS",     value: news.length.toString().padStart(2, "0"),  color: "#7c3aed", glow: "rgba(124,58,237,0.3)" },
    { label: "PLATAFORMAS",  value: platforms.size.toString(),                color: "#06b6d4", glow: "rgba(6,182,212,0.3)" },
    { label: "OFERTAS",      value: deals.length.toString(),                  color: "#34d399", glow: "rgba(52,211,153,0.3)" },
    { label: "LECTURA EST.", value: `~${readTime} min`,                       color: "#ec4899", glow: "rgba(236,72,153,0.3)" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, color, glow }) => (
        <div
          key={label}
          className="rounded-xl border border-white/[0.07] p-4"
          style={{ background: "linear-gradient(135deg, rgba(26,26,46,0.7), rgba(21,21,42,0.5))" }}
        >
          <div className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest mb-2">{label}</div>
          <div
            className="font-archivo text-3xl leading-none"
            style={{ color, textShadow: `0 0 20px ${glow}` }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

function AuthCta() {
  const navigate = useNavigate();
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-accent-purple/25 p-6 cursor-pointer group"
      style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06))",
      }}
      onClick={() => navigate("/register")}
    >
      {/* BG glow */}
      <div
        className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)" }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)" }}
      />

      <div className="relative">
        <span
          className="inline-block font-mono-jet text-[10px] uppercase tracking-widest border border-accent-purple/40 rounded-full px-3 py-1 mb-3"
          style={{ color: "#c4b5fd", background: "rgba(124,58,237,0.12)" }}
        >
          &#9733; &#218;NETE GRATIS
        </span>
        <h3 className="font-grotesk font-bold text-xl text-text-primary leading-tight mb-2">
          Vota en la encuesta<br />semanal &#8594;
        </h3>
        <p className="font-mono-jet text-[11px] text-text-muted mb-5 leading-relaxed">
          Crea tu cuenta y participa en polls, <br />comenta noticias y m&#225;s.
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); navigate("/register"); }}
          className="font-mono-jet text-[11px] bg-accent-purple text-white px-5 py-2.5 rounded-lg hover:bg-accent-purple/80 transition-colors group-hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
        >
          Registrarse gratis
        </button>
      </div>
    </div>
  );
}

function RecentEditions({ currentId }) {
  const navigate = useNavigate();
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    api.get("/news/history").then((res) => {
      setEditions(
        res.data
          .filter((e) => e.id !== currentId)
          .slice(0, 3)
      );
    }).catch(() => {});
  }, [currentId]);

  if (editions.length === 0) return null;

  const formattedDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("es-ES", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-grotesk font-bold text-xl text-text-primary flex items-center gap-3">
          <span className="w-1.5 h-6 rounded-sm bg-text-muted/40 inline-block" />
          Ediciones recientes
        </h3>
        <button
          onClick={() => navigate("/history")}
          className="font-mono-jet text-[11px] text-text-muted hover:text-accent-cyan transition-colors"
        >
          Ver todas &#8594;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {editions.map((ed) => (
          <button
            key={ed.id}
            onClick={() => navigate(`/edition/${ed.id}`)}
            className="group text-left rounded-xl border border-white/[0.07] p-4 transition-all duration-200 hover:border-accent-purple/40 hover:shadow-[0_0_20px_rgba(124,58,237,0.1)]"
            style={{ background: "rgba(26,26,46,0.5)" }}
          >
            <div
              className="font-archivo text-2xl leading-none mb-1.5"
              style={{
                background: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              #{ed.edition}
            </div>
            <p className="font-grotesk font-semibold text-sm text-text-primary group-hover:text-accent-cyan transition-colors">
              Edici&#243;n {ed.edition}
            </p>
            <p className="font-mono-jet text-[10px] text-text-muted mt-1 capitalize">
              {formattedDate(ed.date)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown() {
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    function update() {
      const now = new Date();
      const next = new Date(now);
      next.setUTCHours(13, 0, 0, 0);
      if (now.getUTCHours() >= 13) next.setUTCDate(next.getUTCDate() + 1);
      const diff = next - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${h}h ${m}m`);
    }
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);
  return countdown;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");
  const countdown = useCountdown();

  useEffect(() => {
    api
      .get("/news/latest")
      .then((res) => setNewsletter(res.data))
      .catch(() => setError("Error al cargar el newsletter"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <ScrollProgressBar />
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
          <div className="border-b border-border-dark pb-5 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-40 bg-bg-card rounded-lg animate-pulse" />
              <div className="h-4 w-56 bg-bg-card rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-bg-card rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-bg-card animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            <SkeletonCard featured />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </main>
      </div>
    );
  }

  if (error || !newsletter) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-danger/30" style={{ background: "rgba(239,68,68,0.08)" }}>
            <span className="font-archivo text-3xl text-danger/60">!</span>
          </div>
          <div>
            <p className="font-grotesk font-bold text-lg text-text-primary">Sin se&#241;al</p>
            <p className="font-mono-jet text-[12px] text-text-muted mt-1">{error || "No hay newsletter disponible"}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="font-mono-jet text-[11px] border border-accent-purple/40 text-accent-purple px-5 py-2 rounded-lg hover:bg-accent-purple hover:text-white transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { edition, date, content } = newsletter;
  const { news, deals, pick, poll } = content;

  const formattedDate = (() => {
    const [y, m, d] = date.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("es-ES", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  })();

  const readTime = estimateTotalReadTime(news);

  // Build combined filter options: categories + detected platforms
  const categories = ["Todas", ...new Set(news.map((n) => n.category))];
  const detectedPlatforms = PLATFORM_BUCKETS.filter(({ match }) =>
    news.some((n) => (n.platform || "").toLowerCase().includes(match))
  );

  // Filter news by active filter
  const filteredNews = (() => {
    if (activeFilter === "Todas") return news;
    if (categories.includes(activeFilter)) return news.filter((n) => n.category === activeFilter);
    const plat = detectedPlatforms.find((p) => p.key === activeFilter);
    if (plat) return news.filter((n) => (n.platform || "").toLowerCase().includes(plat.match));
    return news;
  })();

  const showFeatured = activeFilter === "Todas" && filteredNews.length > 0;
  const remaining = showFeatured ? filteredNews.length - 1 : filteredNews.length;
  const lastAloneIndex = remaining % 2 !== 0 ? filteredNews.length - 1 : -1;

  return (
    <div className="min-h-screen bg-bg-primary page-enter">
      <ScrollProgressBar />
      <Navbar edition={edition} />
      <TickerBar items={news} newsletterId={newsletter.id} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* ── Edition header ── */}
        <div className="relative pb-8 mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="absolute bottom-[-1px] left-0 w-64 h-px" style={{ background: "linear-gradient(90deg, #7c3aed, transparent)", boxShadow: "0 0 8px #7c3aed" }} />
          <div className="font-mono-jet text-[11px] text-text-muted tracking-[0.25em] uppercase mb-3 flex items-center gap-2.5">
            <span className="w-6 h-px bg-accent-purple inline-block" />
            Daily Drop &#183;{" "}
            {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-baseline gap-5">
              <div
                className="font-archivo leading-[0.85] tracking-[-0.05em] select-none"
                style={{
                  fontSize: "clamp(72px, 11vw, 148px)",
                  background: "linear-gradient(180deg, #fff 20%, #7c3aed 95%)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                  textShadow: "0 0 80px rgba(124,58,237,0.4)",
                }}
              >
                <span className="glow-purple text-[0.55em] align-[0.4em] mr-1" style={{ WebkitTextFillColor: "#7c3aed" }}>#</span>
                {edition}
              </div>
              <div>
                <div className="font-grotesk font-bold text-lg text-text-muted uppercase tracking-[0.2em]">Edici&#243;n</div>
                <div className="font-mono-jet text-[13px] text-text-muted capitalize mt-3">{formattedDate}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 items-end">
              <span
                className="inline-flex items-center gap-2 font-mono-jet text-[11px] px-3.5 py-2 rounded-full border tracking-[0.1em] uppercase"
                style={{ borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", color: "#fca5a5" }}
              >
                <span className="w-2 h-2 rounded-full bg-danger dot-pulse" style={{ boxShadow: "0 0 10px #ef4444" }} />
                LIVE &#183; On Air
              </span>
              {countdown && (
                <span
                  className="inline-flex items-center gap-2 font-mono-jet text-[11px] px-3.5 py-2 rounded-full border tracking-[0.1em] uppercase text-text-muted"
                  style={{ borderColor: "rgba(6,182,212,0.25)", background: "rgba(255,255,255,0.02)" }}
                >
                  <span className="text-text-muted opacity-60">NEXT DROP</span>
                  <b className="text-accent-cyan">{countdown}</b>
                </span>
              )}
              <span
                className="inline-flex items-center gap-2 font-mono-jet text-[11px] px-3.5 py-2 rounded-full border tracking-[0.1em] uppercase text-text-muted"
                style={{ borderColor: "rgba(107,114,128,0.2)", background: "rgba(255,255,255,0.01)" }}
              >
                <span className="text-text-muted opacity-60">LECTURA</span>
                <b className="text-text-secondary">~{readTime} min</b>
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <EditionStats news={news} deals={deals} readTime={readTime} />

        {/* ── Section nav ── */}
        <SectionNav />

        {/* ── News grid ── */}
        <section id="section-news">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5">
              <span className="w-1.5 h-7 rounded-sm bg-accent-purple inline-block" style={{ boxShadow: "0 0 12px #7c3aed" }} />
              Noticias de la semana
              <span className="font-mono-jet text-[11px] text-text-muted font-normal">
                / {news.length.toString().padStart(2, "0")} stories
              </span>
            </h3>
          </div>

          {/* Filter pills: categories + platforms */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => {
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="font-mono-jet text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all duration-200"
                  style={active
                    ? { borderColor: "#7c3aed", background: "rgba(124,58,237,0.2)", color: "#c4b5fd", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }
                    : { borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}
                >
                  {cat}
                </button>
              );
            })}
            {detectedPlatforms.length > 0 && (
              <>
                <span className="font-mono-jet text-[10px] text-text-muted/40 self-center px-1">/</span>
                {detectedPlatforms.map(({ key }) => {
                  const active = activeFilter === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveFilter(key)}
                      className="font-mono-jet text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all duration-200"
                      style={active
                        ? { borderColor: "#06b6d4", background: "rgba(6,182,212,0.15)", color: "#67e8f9", boxShadow: "0 0 12px rgba(6,182,212,0.25)" }
                        : { borderColor: "rgba(6,182,212,0.15)", color: "var(--text-muted)" }}
                    >
                      {key}
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 border border-white/[0.06] rounded-2xl" style={{ background: "rgba(26,26,46,0.4)" }}>
              <p className="font-grotesk font-bold text-text-primary">Sin noticias para &ldquo;{activeFilter}&rdquo;</p>
              <button onClick={() => setActiveFilter("Todas")} className="font-mono-jet text-[11px] text-accent-cyan hover:underline">Mostrar todas</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
              {filteredNews.map((item, fi) => {
                const i = news.indexOf(item);
                return (
                  <NewsCard
                    key={i}
                    {...item}
                    newsletterId={newsletter.id}
                    newsIndex={i}
                    index={fi}
                    featured={showFeatured && fi === 0}
                    lastAlone={fi === lastAloneIndex}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* ── Auth CTA (guests only) ── */}
        {!isAuthenticated && (
          <AuthCta />
        )}

        <SectionDivider label="// 02 &#8212; OFERTAS / ENCUESTA" />

        {/* ── Deals + Poll ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section id="section-deals">
            <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5 mb-6">
              <span className="w-1.5 h-7 rounded-sm bg-accent-cyan inline-block" style={{ boxShadow: "0 0 12px #06b6d4" }} />
              Ofertas de la semana
              <span className="font-mono-jet text-[11px] text-text-muted font-normal">
                / {deals.length.toString().padStart(2, "0")} active
              </span>
            </h3>
            <DealsSection deals={deals} />
          </section>

          <section id="section-poll">
            <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5 mb-6">
              <span className="w-1.5 h-7 rounded-sm bg-accent-pink inline-block" style={{ boxShadow: "0 0 12px #ec4899" }} />
              Encuesta del feed
              <span className="font-mono-jet text-[11px] text-text-muted font-normal">/ 01 active</span>
            </h3>
            <PollSection poll={poll} newsletterId={newsletter.id} />
          </section>
        </div>

        <SectionDivider label="// 03 &#8212; PICK OF THE WEEK" />

        {/* ── Pick of the week ── */}
        <section id="section-pick">
          <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5 mb-6">
            <span className="w-1.5 h-7 rounded-sm bg-accent-yellow inline-block" style={{ boxShadow: "0 0 12px #f59e0b" }} />
            Pick of the Week
            <span className="font-mono-jet text-[11px] text-text-muted font-normal">/ editor&apos;s choice</span>
          </h3>
          <PickOfWeek pick={pick} />
        </section>

        <SectionDivider label="// 04 &#8212; ARCHIVO" />

        {/* ── Recent editions teaser ── */}
        <RecentEditions currentId={newsletter.id} />

        {/* ── Older news (paginated) ── */}
        <OlderNews />

      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
