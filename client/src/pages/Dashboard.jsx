import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import SkeletonCard from "../components/SkeletonCard";
import DealsSection from "../components/DealsSection";
import PickOfWeek from "../components/PickOfWeek";
import PollSection from "../components/PollSection";
import ScrollProgressBar from "../components/ScrollProgressBar";
import TickerBar from "../components/TickerBar";
import Footer from "../components/Footer";
import api from "../api/axios";

function SectionDivider({ label = "// SECTION" }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div
        className="w-2.5 h-2.5 flex-shrink-0 rotate-45 bg-accent-purple"
        style={{ boxShadow: "0 0 10px #7c3aed" }}
      />
      <span className="font-mono-jet text-[11px] text-text-muted tracking-widest uppercase flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-accent-purple/30 to-transparent" />
    </div>
  );
}

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

export default function Dashboard() {
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const countdown = useCountdown();

  useEffect(() => {
    api
      .get("/news/latest")
      .then((res) => setNewsletter(res.data))
      .catch(() => setError("Error al cargar el newsletter"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 450);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-danger">{error || "No hay newsletter disponible"}</p>
      </div>
    );
  }

  const { edition, date, content } = newsletter;
  const { news, deals, pick, poll } = content;

  const formattedDate = (() => {
    const [y, m, d] = date.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
      "es-ES",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  })();

  return (
    <div className="min-h-screen bg-bg-primary">
      <ScrollProgressBar />
      <Navbar edition={edition} />
      <TickerBar items={news} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Edition header */}
        <div
          className="relative pb-8 mb-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="absolute bottom-[-1px] left-0 w-64 h-px"
            style={{
              background: "linear-gradient(90deg, #7c3aed, transparent)",
              boxShadow: "0 0 8px #7c3aed",
            }}
          />
          <div className="font-mono-jet text-[11px] text-text-muted tracking-[0.25em] uppercase mb-3 flex items-center gap-2.5">
            <span className="w-6 h-px bg-accent-purple inline-block" />
            Daily Drop ·{" "}
            {new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-baseline gap-5">
              <div
                className="font-archivo leading-[0.85] tracking-[-0.05em] select-none"
                style={{
                  fontSize: "clamp(72px, 11vw, 148px)",
                  background: "linear-gradient(180deg, #fff 20%, #7c3aed 95%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 0 80px rgba(124,58,237,0.4)",
                }}
              >
                <span
                  className="glow-purple text-[0.55em] align-[0.4em] mr-1"
                  style={{ WebkitTextFillColor: "#7c3aed" }}
                >
                  #
                </span>
                {edition}
              </div>
              <div>
                <div className="font-grotesk font-bold text-lg text-text-muted uppercase tracking-[0.2em]">
                  Edición
                </div>
                <div className="font-mono-jet text-[13px] text-text-muted capitalize mt-3">
                  {formattedDate}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 items-end">
              <span
                className="inline-flex items-center gap-2 font-mono-jet text-[11px] px-3.5 py-2 rounded-full border tracking-[0.1em] uppercase"
                style={{
                  borderColor: "rgba(239,68,68,0.4)",
                  background: "rgba(239,68,68,0.08)",
                  color: "#fca5a5",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-danger dot-pulse"
                  style={{ boxShadow: "0 0 10px #ef4444" }}
                />
                LIVE · On Air
              </span>
              {countdown && (
                <span
                  className="inline-flex items-center gap-2 font-mono-jet text-[11px] px-3.5 py-2 rounded-full border tracking-[0.1em] uppercase text-text-muted"
                  style={{
                    borderColor: "rgba(6,182,212,0.25)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <span className="text-text-muted opacity-60">NEXT DROP</span>
                  <b className="text-accent-cyan">{countdown}</b>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* News grid */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5">
              <span
                className="w-1.5 h-7 rounded-sm bg-accent-purple inline-block"
                style={{ boxShadow: "0 0 12px #7c3aed" }}
              />
              Noticias de la semana
              <span className="font-mono-jet text-[11px] text-text-muted font-normal">
                / {news.length.toString().padStart(2, "0")} stories
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Todas", ...new Set(news.map((n) => n.category))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="font-mono-jet text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all duration-200"
                  style={
                    activeCategory === cat
                      ? {
                          borderColor: "#7c3aed",
                          background: "rgba(124,58,237,0.2)",
                          color: "#c4b5fd",
                          boxShadow: "0 0 12px rgba(124,58,237,0.3)",
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.08)",
                          color: "var(--text-muted)",
                        }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {(() => {
            const filtered =
              activeCategory === "Todas"
                ? news
                : news.filter((n) => n.category === activeCategory);
            const showFeatured =
              activeCategory === "Todas" && filtered.length > 0;
            const remaining = showFeatured
              ? filtered.length - 1
              : filtered.length;
            const lastAloneIndex =
              remaining % 2 !== 0 ? filtered.length - 1 : -1;
            return (
              <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                {filtered.map((item, fi) => {
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
            );
          })()}
        </section>

        <SectionDivider label="// 02 — OFERTAS / ENCUESTA" />

        {/* Deals + Poll */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5 mb-6">
              <span
                className="w-1.5 h-7 rounded-sm bg-accent-cyan inline-block"
                style={{ boxShadow: "0 0 12px #06b6d4" }}
              />
              Ofertas de la semana
              <span className="font-mono-jet text-[11px] text-text-muted font-normal">
                / 03 active
              </span>
            </h3>
            <DealsSection deals={deals} />
          </section>

          <section>
            <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5 mb-6">
              <span
                className="w-1.5 h-7 rounded-sm bg-accent-pink inline-block"
                style={{ boxShadow: "0 0 12px #ec4899" }}
              />
              Encuesta del feed
              <span className="font-mono-jet text-[11px] text-text-muted font-normal">
                / 01 active
              </span>
            </h3>
            <PollSection poll={poll} newsletterId={newsletter.id} />
          </section>
        </div>

        <SectionDivider label="// 03 — PICK OF THE WEEK" />

        {/* Pick of the week */}
        <section>
          <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5 mb-6">
            <span
              className="w-1.5 h-7 rounded-sm bg-accent-yellow inline-block"
              style={{ boxShadow: "0 0 12px #f59e0b" }}
            />
            Pick of the Week
            <span className="font-mono-jet text-[11px] text-text-muted font-normal">
              / editor's choice
            </span>
          </h3>
          <PickOfWeek pick={pick} />
        </section>
      </main>

      <Footer />

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-accent-purple text-white flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:bg-accent-purple/80 hover:scale-110 transition-all duration-200 border border-accent-purple/50 font-bold text-lg"
          title="Volver arriba"
        >
          ↑
        </button>
      )}
    </div>
  );
}
