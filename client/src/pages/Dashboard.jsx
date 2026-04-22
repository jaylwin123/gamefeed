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

function SectionDivider({ color = "purple" }) {
  const gradients = {
    purple: "from-transparent via-accent-purple/30 to-transparent",
    cyan: "from-transparent via-accent-cyan/30 to-transparent",
    pink: "from-transparent via-accent-pink/30 to-transparent",
    yellow: "from-transparent via-accent-yellow/30 to-transparent",
  };
  return (
    <div
      className={`h-px bg-gradient-to-r ${gradients[color] || gradients.purple}`}
    />
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dark pb-5">
          <div>
            <h2 className="text-2xl font-black text-text-primary">
              Edición{" "}
              <span className="glow-text text-accent-purple font-display text-3xl">
                #{edition}
              </span>
            </h2>
            <p className="text-sm text-text-muted mt-1 capitalize">
              {formattedDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {countdown && (
              <span className="text-xs text-text-muted border border-border-dark rounded px-3 py-1.5 font-mono">
                Próxima en {countdown}
              </span>
            )}
            <span className="text-xs text-accent-cyan border border-accent-cyan/30 rounded px-3 py-1.5 font-mono">
              LIVE 🔴
            </span>
          </div>
        </div>

        {/* News grid */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-purple rounded-full inline-block" />
              Noticias de la semana
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Todas", ...new Set(news.map((n) => n.category))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    activeCategory === cat
                      ? "bg-accent-purple border-accent-purple text-white"
                      : "border-border-dark text-text-muted hover:border-accent-purple hover:text-text-primary"
                  }`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <SectionDivider color="cyan" />

        {/* Deals + Poll */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-cyan rounded-full inline-block" />
              Ofertas de la semana
            </h3>
            <DealsSection deals={deals} />
          </section>

          <section>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-pink rounded-full inline-block" />
              Encuesta del feed
            </h3>
            <PollSection poll={poll} newsletterId={newsletter.id} />
          </section>
        </div>

        <SectionDivider color="yellow" />

        {/* Pick of the week */}
        <section>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent-yellow rounded-full inline-block" />
            Pick of the Week
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

export default function Dashboard() {
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

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
      <Navbar edition={edition} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Edition header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dark pb-5">
          <div>
            <h2 className="text-2xl font-black text-text-primary">
              Edición <span className="text-accent-purple">#{edition}</span>
            </h2>
            <p className="text-sm text-text-muted mt-1 capitalize">
              {formattedDate}
            </p>
          </div>
          <span className="text-xs text-accent-cyan border border-accent-cyan/30 rounded px-3 py-1.5 font-mono">
            LIVE 🔴
          </span>
        </div>

        {/* News grid */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-purple rounded-full inline-block" />
              Noticias de la semana
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Todas", ...new Set(news.map((n) => n.category))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    activeCategory === cat
                      ? "bg-accent-purple border-accent-purple text-white"
                      : "border-border-dark text-text-muted hover:border-accent-purple hover:text-text-primary"
                  }`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((item, fi) => {
                  const i = news.indexOf(item);
                  return (
                    <NewsCard
                      key={i}
                      {...item}
                      newsletterId={newsletter.id}
                      newsIndex={i}
                      featured={showFeatured && fi === 0}
                      lastAlone={fi === lastAloneIndex}
                    />
                  );
                })}
              </div>
            );
          })()}
        </section>

        {/* Deals + Poll */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-cyan rounded-full inline-block" />
              Ofertas de la semana
            </h3>
            <DealsSection deals={deals} />
          </section>

          <section>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-pink rounded-full inline-block" />
              Encuesta del feed
            </h3>
            <PollSection poll={poll} newsletterId={newsletter.id} />
          </section>
        </div>

        {/* Pick of the week */}
        <section>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent-yellow rounded-full inline-block" />
            Pick of the Week
          </h3>
          <PickOfWeek pick={pick} />
        </section>
      </main>
    </div>
  );
}
