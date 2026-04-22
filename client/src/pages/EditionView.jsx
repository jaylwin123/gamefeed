import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import DealsSection from "../components/DealsSection";
import PickOfWeek from "../components/PickOfWeek";
import PollSection from "../components/PollSection";
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
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-danger">{error || "Edición no encontrada"}</p>
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
    <div className="min-h-screen bg-bg-primary">
      <Navbar edition={edition} />
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
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent-purple rounded-full inline-block" />
            Noticias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item, i) => (
              <NewsCard key={i} {...item} />
            ))}
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
    </div>
  );
}
