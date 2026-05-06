import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);
  const interactive = Boolean(onChange);
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => interactive && onChange(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(null)}
          disabled={!interactive}
          className={`text-xl transition-all ${
            n <= (hover ?? value) ? "text-accent-yellow" : "text-border-dark"
          } ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default pointer-events-none"}`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const date = new Date(review.createdAt).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", year: "numeric",
  });
  return (
    <div
      className="rounded-xl border border-white/[0.07] p-4 flex flex-col gap-3"
      style={{ background: "rgba(26,26,46,0.5)" }}
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="font-grotesk font-bold text-sm text-accent-cyan">{review.username}</span>
          <StarRating value={review.rating} />
        </div>
        <span className="font-mono-jet text-[10px] text-text-muted flex-shrink-0">{date}</span>
      </div>
      {review.body && (
        <p className="font-mono-jet text-[12px] text-text-secondary leading-relaxed">{review.body}</p>
      )}
    </div>
  );
}

export default function GamePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navState = location.state || {};

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const [form, setForm] = useState({ rating: 0, body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-dismiss success after 3s
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  async function loadGame() {
    try {
      const res = await api.get(`/games/${slug}`);
      setGame(res.data.game);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setMyRating(res.data.myRating);
      if (res.data.myRating) setForm((f) => ({ ...f, rating: res.data.myRating }));
    } catch {
      setGame(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (navState.title && isAuthenticated) {
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
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const displayTitle    = game?.title    || navState.title    || slug;
  const displayImage    = game?.image    || navState.image    || null;
  const displayPlatform = game?.platform || navState.platform || null;
  const scoreLabel = avgRating
    ? avgRating >= 9 ? "MASTERPIECE" : avgRating >= 8 ? "EXCELLENT" : avgRating >= 7 ? "GREAT" : "GOOD"
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col page-enter">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="font-mono-jet text-[11px] text-text-muted hover:text-accent-cyan transition-colors mb-8 flex items-center gap-1.5"
        >
          <span className="text-accent-cyan">&#8592;</span> Volver
        </button>

        {/* Game header */}
        <div
          className="relative rounded-2xl border border-white/[0.08] overflow-hidden mb-10 p-6 flex flex-col sm:flex-row gap-6 items-start"
          style={{ background: "linear-gradient(135deg, rgba(26,26,46,0.8), rgba(21,21,42,0.6))" }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #7c3aed 50%, transparent)" }}
          />

          {/* Cover */}
          <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden flex-shrink-0 border border-white/[0.08]">
            {displayImage && !imgError ? (
              <img
                src={displayImage}
                alt={displayTitle}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))" }}
              >
                <span className="font-archivo text-4xl text-white/20">&#9654;</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 min-w-0">
            <span className="font-mono-jet text-[10px] text-text-muted uppercase tracking-[0.2em]">Juego</span>
            <h1 className="font-archivo text-3xl text-text-primary leading-tight">{displayTitle}</h1>
            {displayPlatform && (
              <span
                className="font-mono-jet text-[11px] text-text-muted border border-white/[0.1] rounded-lg px-3 py-1 w-fit"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {displayPlatform}
              </span>
            )}
          </div>

          {/* Avg score badge */}
          {avgRating && (
            <div className="sm:ml-auto flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="font-archivo text-5xl leading-none"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #ec4899)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  textShadow: "0 0 30px rgba(245,158,11,0.3)",
                }}
              >
                {avgRating}
              </div>
              <div className="font-mono-jet text-[10px] text-text-muted">/ 10</div>
              {scoreLabel && (
                <div className="font-archivo text-[10px] tracking-widest text-accent-yellow/70 uppercase">{scoreLabel}</div>
              )}
              <div className="font-mono-jet text-[10px] text-text-muted">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: score bar + review form */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Score bar */}
            {avgRating && (
              <div
                className="rounded-xl border border-white/[0.07] p-5"
                style={{ background: "rgba(26,26,46,0.5)" }}
              >
                <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest mb-3">
                  Score comunidad
                </p>
                <div className="w-full rounded-full h-2 mb-2" style={{ background: "rgba(45,45,78,1)" }}>
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${(parseFloat(avgRating) / 10) * 100}%`,
                      background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                      boxShadow: "0 0 8px rgba(6,182,212,0.4)",
                    }}
                  />
                </div>
                <div className="flex justify-between font-mono-jet text-[10px] text-text-muted">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            )}

            {/* Review form */}
            <div
              className="rounded-xl border border-white/[0.08] p-5"
              style={{ background: "rgba(26,26,46,0.5)" }}
            >
              <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest mb-5">
                {myRating ? "Tu review" : "Dejar review"}
              </p>

              {!isAuthenticated ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-accent-purple/30"
                    style={{ background: "rgba(124,58,237,0.1)" }}
                  >
                    <span className="font-archivo text-xl text-accent-purple/60">&#9733;</span>
                  </div>
                  <p className="font-mono-jet text-[12px] text-text-secondary">
                    Inici&#225; sesi&#243;n para dejar tu review.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="font-mono-jet text-[11px] border border-accent-purple text-accent-purple px-4 py-2 rounded-lg hover:bg-accent-purple hover:text-white transition-colors"
                    >
                      Iniciar sesi&#243;n
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="font-mono-jet text-[11px] bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple/80 transition-colors"
                    >
                      Crear cuenta
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Success toast */}
                  {success && (
                    <div
                      className="mb-4 p-3 rounded-xl border border-success/30 flex items-center gap-2.5"
                      style={{ background: "rgba(52,211,153,0.08)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7L6 11L12 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-mono-jet text-[11px] text-success">Review guardado correctamente</span>
                    </div>
                  )}

                  <form onSubmit={submitReview} className="flex flex-col gap-4">
                    <div>
                      <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest mb-2">Puntaje</p>
                      <StarRating value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
                    </div>
                    <textarea
                      value={form.body}
                      onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                      placeholder="¿Qué opinás del juego?"
                      rows={4}
                      maxLength={600}
                      className="w-full rounded-xl px-4 py-3 font-mono-jet text-[12px] text-text-primary placeholder-text-muted/50 border border-white/[0.1] focus:outline-none focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] resize-none transition-all"
                      style={{ background: "rgba(13,13,15,0.8)" }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-mono-jet text-[10px] text-text-muted">{form.body.length}/600</span>
                      {formError && <p className="font-mono-jet text-[10px] text-danger">{formError}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl font-mono-jet text-[11px] uppercase tracking-widest font-bold text-white transition-all disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                        boxShadow: submitting ? "none" : "0 0 20px rgba(124,58,237,0.3)",
                      }}
                    >
                      {submitting ? "Guardando…" : myRating ? "Actualizar review" : "Publicar review"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right: reviews list */}
          {reviews.length > 0 && (
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-3">
              <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest">
                Reviews ({reviews.length})
              </p>
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
