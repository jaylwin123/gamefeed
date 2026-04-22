import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const CATEGORY_COLORS = {
  LANZAMIENTO: "bg-accent-purple text-white",
  "EXPANSIÓN": "bg-accent-cyan text-black",
  INDUSTRIA: "bg-accent-yellow text-black",
  "ACTUALIZACIÓN": "bg-success text-black",
  DEFAULT: "bg-accent-pink text-white",
};

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(null)}
          className={`text-lg transition-colors ${
            n <= (hover ?? value)
              ? "text-accent-yellow"
              : "text-border-dark"
          } ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-bg-primary border border-border-dark rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-bold text-accent-cyan">{review.username}</span>
        <StarRating value={review.rating} />
        <span className="text-xs text-text-muted ml-auto">
          {new Date(review.createdAt).toLocaleDateString("es-ES", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{review.body}</p>
    </div>
  );
}

export default function NewsArticle() {
  const { newsletterId, newsIndex } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    api.get(`/news/${newsletterId}`).then((res) => {
      const content = res.data.content;
      const item = content.news?.[Number(newsIndex)];
      setNews(item || null);
    }).catch(() => setNews(null)).finally(() => setLoading(false));

    api.get(`/news/${newsletterId}/reviews/${newsIndex}`).then((res) => {
      setReviews(res.data.reviews);
      setMyRating(res.data.myRating);
      if (res.data.myRating) setReviewForm((f) => ({ ...f, rating: res.data.myRating }));
    }).catch(() => {});
  }, [newsletterId, newsIndex]);

  async function submitReview(e) {
    e.preventDefault();
    if (!reviewForm.rating) return setReviewError("Selecciona un puntaje");
    if (!reviewForm.body.trim()) return setReviewError("Escribe tu review");
    setSubmitting(true);
    setReviewError("");
    try {
      await api.post(`/news/${newsletterId}/reviews/${newsIndex}`, reviewForm);
      const res = await api.get(`/news/${newsletterId}/reviews/${newsIndex}`);
      setReviews(res.data.reviews);
      setMyRating(reviewForm.rating);
      setReviewForm((f) => ({ ...f, body: "" }));
    } catch {
      setReviewError("Error al guardar el review");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-danger">Noticia no encontrada</p>
      </div>
    );
  }

  const badgeClass = CATEGORY_COLORS[news.category] || CATEGORY_COLORS.DEFAULT;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-text-muted hover:text-text-primary transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna principal — artículo */}
          <article className="flex-1 min-w-0">
            {/* Imagen hero */}
            {news.image && (
              <div className="relative h-72 rounded-2xl overflow-hidden mb-6">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
              </div>
            )}

            {/* Categoría + plataforma */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`text-xs font-bold px-3 py-1 rounded ${badgeClass}`}>
                {news.category}
              </span>
              <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1">
                {news.platform}
              </span>
              {news.source && (
                <span className="text-xs text-text-muted">
                  Fuente: <span className="text-text-secondary">{news.source}</span>
                </span>
              )}
            </div>

            {/* Titular */}
            <h1 className="text-3xl font-black text-text-primary leading-tight mb-4">
              {news.title}
            </h1>

            {/* Bajada / entradilla */}
            <p className="text-lg text-accent-cyan font-medium leading-relaxed mb-6 border-l-2 border-accent-purple pl-4">
              {news.description}
            </p>

            {/* Cuerpo completo */}
            {news.fullDescription && (
              <div className="prose prose-invert max-w-none">
                {news.fullDescription.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i} className="text-text-secondary leading-relaxed mb-4 text-base">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Links externos */}
            {(news.url || news.reviewLinks?.length > 0) && (
              <div className="mt-8 p-4 bg-bg-card border border-border-dark rounded-xl flex flex-col gap-3">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Links relacionados
                </p>
                {news.url && (
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent-cyan hover:underline"
                  >
                    📰 Fuente original — {news.source || news.url}
                  </a>
                )}
                {news.reviewLinks?.map((rl, i) => (
                  <a
                    key={i}
                    href={rl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent-purple hover:underline"
                  >
                    🎮 Review: {rl.label || rl.url}
                  </a>
                ))}
              </div>
            )}

            {/* Share */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: news.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copiado");
                }
              }}
              className="mt-6 text-xs border border-border-dark text-text-muted rounded px-4 py-2 hover:border-accent-purple hover:text-accent-purple transition-colors"
            >
              Compartir esta noticia ↗
            </button>
          </article>

          {/* Columna lateral — reviews */}
          <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
            {/* Score promedio */}
            <div className="bg-bg-card border border-border-dark rounded-xl p-5 text-center">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">
                Score comunidad
              </p>
              {avgRating ? (
                <>
                  <div className="text-5xl font-black text-accent-cyan mb-1">{avgRating}</div>
                  <div className="text-text-muted text-sm mb-2">/ 10</div>
                  <div className="w-full bg-border-dark rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full"
                      style={{ width: `${(parseFloat(avgRating) / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted mt-2">{reviews.length} reviews</p>
                </>
              ) : (
                <p className="text-text-muted text-sm">Sin reviews aún</p>
              )}
            </div>

            {/* Formulario de review */}
            <div className="bg-bg-card border border-border-dark rounded-xl p-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                {myRating ? "Tu review" : "Dejar review"}
              </p>
              <form onSubmit={submitReview} className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-text-muted mb-2">Puntaje</p>
                  <StarRating
                    value={reviewForm.rating}
                    onChange={(n) => setReviewForm((f) => ({ ...f, rating: n }))}
                  />
                </div>
                <textarea
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="¿Qué te parece esta noticia?"
                  rows={4}
                  maxLength={500}
                  className="w-full bg-bg-primary border border-border-dark rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent-purple transition-colors"
                />
                {reviewError && (
                  <p className="text-xs text-danger">{reviewError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-accent-purple text-white text-sm font-bold rounded-lg hover:bg-accent-purple/80 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Guardando…" : myRating ? "Actualizar review" : "Publicar review"}
                </button>
              </form>
            </div>

            {/* Lista de reviews */}
            {reviews.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Reviews ({reviews.length})
                </p>
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
