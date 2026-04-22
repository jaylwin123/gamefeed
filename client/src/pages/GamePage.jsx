import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(null)}
          className={`text-xl transition-colors ${
            n <= (hover ?? value) ? "text-accent-yellow" : "text-border-dark"
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
        <span className="text-sm font-bold text-accent-cyan">
          {review.username}
        </span>
        <StarRating value={review.rating} />
        <span className="text-xs text-text-muted ml-auto">
          {new Date(review.createdAt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      {review.body && (
        <p className="text-sm text-text-secondary leading-relaxed">
          {review.body}
        </p>
      )}
    </div>
  );
}

export default function GamePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ rating: 0, body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  async function loadGame() {
    try {
      const res = await api.get(`/games/${slug}`);
      setGame(res.data.game);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setMyRating(res.data.myRating);
      if (res.data.myRating) {
        setForm((f) => ({ ...f, rating: res.data.myRating }));
      }
    } catch {
      // Juego aún no registrado — usar datos del state
      setGame(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Si viene con state, registrar el juego primero (upsert)
    if (navState.title) {
      api
        .post(`/games/${slug}`, {
          title: navState.title,
          image: navState.image || null,
          platform: navState.platform || null,
        })
        .catch(() => {})
        .finally(() => loadGame());
    } else {
      loadGame();
    }
  }, [slug]);

  async function submitReview(e) {
    e.preventDefault();
    if (!form.rating) return setFormError("Seleccioná un puntaje");
    if (!form.body.trim()) return setFormError("Escribí tu review");
    setSubmitting(true);
    setFormError("");
    try {
      await api.post(`/games/${slug}/reviews`, form);
      setSuccess(true);
      setForm((f) => ({ ...f, body: "" }));
      await loadGame();
    } catch {
      setFormError("Error al guardar el review");
    } finally {
      setSubmitting(false);
    }
  }

  const displayTitle = game?.title || navState.title || slug;
  const displayImage = game?.image || navState.image || null;
  const displayPlatform = game?.platform || navState.platform || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-text-muted hover:text-text-primary transition-colors mb-6 flex items-center gap-1"
        >
          ← Volver
        </button>

        {/* Header del juego */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10">
          {displayImage && (
            <div className="w-full sm:w-48 h-32 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={displayImage}
                alt={displayTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.parentElement.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex flex-col justify-center gap-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Juego
            </p>
            <h1 className="text-3xl font-black text-text-primary leading-tight">
              {displayTitle}
            </h1>
            {displayPlatform && (
              <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1 w-fit">
                {displayPlatform}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Score comunidad */}
          <div className="flex flex-col gap-6 w-full lg:w-56 flex-shrink-0">
            <div className="bg-bg-card border border-border-dark rounded-xl p-5 text-center">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
                Score comunidad
              </p>
              {avgRating ? (
                <>
                  <div className="text-6xl font-black text-accent-cyan mb-1">
                    {avgRating}
                  </div>
                  <div className="text-text-muted text-sm mb-3">/ 10</div>
                  <div className="w-full bg-border-dark rounded-full h-2 mb-2">
                    <div
                      className="h-2 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full transition-all"
                      style={{
                        width: `${(parseFloat(avgRating) / 10) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-text-muted">
                    {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </>
              ) : (
                <p className="text-text-muted text-sm">Sin reviews aún</p>
              )}
            </div>
          </div>

          {/* Reviews + form */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Formulario */}
            <div className="bg-bg-card border border-border-dark rounded-xl p-5">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
                {myRating ? "Tu review" : "Dejar review"}
              </p>
              {success && (
                <p className="text-xs text-success mb-3">
                  ✓ Review guardado correctamente
                </p>
              )}
              <form onSubmit={submitReview} className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-2">Puntaje</p>
                  <StarRating
                    value={form.rating}
                    onChange={(n) => {
                      setForm((f) => ({ ...f, rating: n }));
                      setSuccess(false);
                    }}
                  />
                </div>
                <textarea
                  value={form.body}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, body: e.target.value }));
                    setSuccess(false);
                  }}
                  placeholder="¿Qué opinás del juego?"
                  rows={4}
                  maxLength={600}
                  className="w-full bg-bg-primary border border-border-dark rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent-purple transition-colors"
                />
                {formError && (
                  <p className="text-xs text-danger">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-accent-purple text-white text-sm font-bold rounded-lg hover:bg-accent-purple/80 transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "Guardando…"
                    : myRating
                      ? "Actualizar review"
                      : "Publicar review"}
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
          </div>
        </div>
      </main>
    </div>
  );
}
