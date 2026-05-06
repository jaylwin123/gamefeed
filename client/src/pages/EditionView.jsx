import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import DealsSection from "../components/DealsSection";
import PickOfWeek from "../components/PickOfWeek";
import PollSection from "../components/PollSection";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import TickerBar from "../components/TickerBar";
import api from "../api/axios";

export default function EditionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/news/${id}`)
      .then((res) => setNewsletter(res.data))
      .catch(() => setError("No se pudo cargar esta edición"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !newsletter) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center border border-danger/30"
            style={{ background: "rgba(239,68,68,0.08)" }}
          >
            <span className="font-archivo text-3xl text-danger/60">!</span>
          </div>
          <div>
            <p className="font-grotesk font-bold text-lg text-text-primary">Edición no encontrada</p>
            <p className="font-mono-jet text-[12px] text-text-muted mt-1">{error || "Esta edición no existe o fue eliminada"}</p>
          </div>
          <button
            onClick={() => navigate("/history")}
            className="font-mono-jet text-[11px] border border-accent-purple/40 text-accent-purple px-5 py-2 rounded-lg hover:bg-accent-purple hover:text-white transition-colors"
          >
            &#8592; Ver todas las ediciones
          </button>
        </div>
      </div>
    );
  }

  const { edition, date, content } = newsletter;
  const { news, deals, pick, poll } = content;

  const formattedDate = (() => {
    const [y, m, d] = date.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
      "es-ES",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" },
    );
  })();

  return (
    <div className="min-h-screen bg-bg-primary page-enter">
      <Navbar edition={edition} />
      <TickerBar items={news} newsletterId={newsletter.id} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dark pb-5">
          <div>
            <button
              onClick={() => navigate("/history")}
              className="text-xs text-text-muted hover:text-text-primary transition-colors mb-2 flex items-center gap-1"
            >
              ← Archivo
            </button>
            <h2 className="text-2xl font-black text-text-primary">
              Edición <span className="text-accent-purple">#{edition}</span>
            </h2>
            <p className="text-sm text-text-muted mt-1 capitalize">
              {formattedDate}
            </p>
          </div>
          <span className="text-xs text-text-muted border border-border-dark rounded px-3 py-1.5 font-mono">
            ARCHIVO
          </span>
        </div>

        <section>
          <h3 className="font-grotesk font-bold text-2xl text-text-primary flex items-center gap-3.5 mb-6">
            <span className="w-1.5 h-7 rounded-sm bg-accent-purple inline-block" style={{ boxShadow: "0 0 12px #7c3aed" }} />
            Noticias
            <span className="font-mono-jet text-[11px] text-text-muted font-normal">
              / {news.length.toString().padStart(2, "0")} stories
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {news.map((item, i) => {
              const lastAlone = news.length % 2 !== 0 && i === news.length - 1;
              return (
                <NewsCard
                  key={i}
                  {...item}
                  newsletterId={newsletter.id}
                  newsIndex={i}
                  index={i}
                  featured={i === 0}
                  lastAlone={lastAlone}
                />
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-cyan rounded-full inline-block" />
              Ofertas
            </h3>
            <DealsSection deals={deals} />
          </section>
          <section>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-pink rounded-full inline-block" />
              Encuesta
            </h3>
            <PollSection poll={poll} newsletterId={newsletter.id} />
          </section>
        </div>

        {pick && (
          <section>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent-yellow rounded-full inline-block" />
              Pick of the Week
            </h3>
            <PickOfWeek pick={pick} />
          </section>
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
