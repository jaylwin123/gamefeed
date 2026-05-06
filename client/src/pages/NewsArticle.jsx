import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScrollProgressBar from "../components/ScrollProgressBar";
import BackToTop from "../components/BackToTop";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// ── helpers ─────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  LANZAMIENTO:   { bg: "rgba(124,58,237,0.15)",  text: "#c4b5fd", border: "rgba(124,58,237,0.4)" },
  EXPANSIÓN:     { bg: "rgba(6,182,212,0.15)",   text: "#67e8f9", border: "rgba(6,182,212,0.4)" },
  INDUSTRIA:     { bg: "rgba(245,158,11,0.15)",  text: "#fcd34d", border: "rgba(245,158,11,0.4)" },
  ACTUALIZACIÓN: { bg: "rgba(52,211,153,0.15)",  text: "#6ee7b7", border: "rgba(52,211,153,0.4)" },
  DEFAULT:       { bg: "rgba(236,72,153,0.15)",  text: "#f9a8d4", border: "rgba(236,72,153,0.4)" },
};

function estimateReadTime(news) {
  const text = [news.body || "", news.lead || "", news.description || ""].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

function slugify(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

// ── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);
  const interactive = Boolean(onChange);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n} type="button"
          onClick={() => interactive && onChange(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(null)}
          disabled={!interactive}
          className={`text-lg transition-all ${n <= (hover ?? value) ? "text-accent-yellow" : "text-border-dark"} ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default pointer-events-none"}`}
        >&#9733;</button>
      ))}
    </div>
  );
}

// ── ReviewCard ───────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="rounded-xl border border-white/[0.07] p-4 flex flex-col gap-2" style={{ background: "rgba(26,26,46,0.5)" }}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="font-grotesk font-bold text-sm text-accent-cyan">{review.username}</span>
          <StarRating value={review.rating} />
        </div>
        <span className="font-mono-jet text-[10px] text-text-muted flex-shrink-0">
          {new Date(review.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
      {review.body && <p className="font-mono-jet text-[12px] text-text-secondary leading-relaxed">{review.body}</p>}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function NewsArticle() {
  const { newsletterId, newsIndex } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [news, setNews]           = useState(null);
  const [allNews, setAllNews]     = useState([]);
  const [loading, setLoading]     = useState(true);

  const [reviews, setReviews]     = useState([]);
  const [myRating, setMyRating]   = useState(null);
  const [form, setForm]           = useState({ rating: 0, body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [copied, setCopied]       = useState(false);

  useEffect(() => {
    if (!reviewSuccess) return;
    const t = setTimeout(() => setReviewSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [reviewSuccess]);

  const loadReviews = useCallback(async () => {
    try {
      const res = await api.get(`/news/${newsletterId}/reviews/${newsIndex}`);
      setReviews(res.data.reviews || []);
      setMyRating(res.data.myRating ?? null);
      if (res.data.myRating) setForm((f) => ({ ...f, rating: res.data.myRating }));
    } catch { /* silently fail */ }
  }, [newsletterId, newsIndex]);

  useEffect(() => {
    api.get(`/news/${newsletterId}`)
      .then((res) => {
        const content = res.data.content;
        setNews(content.news?.[Number(newsIndex)] ?? null);
        setAllNews(content.news || []);
      })
      .catch(() => setNews(null))
      .finally(() => setLoading(false));
    loadReviews();
  }, [newsletterId, newsIndex, loadReviews]);

  async function submitReview(e) {
    e.preventDefault();
    if (!form.rating) return setFormError("Seleccioná un puntaje");
    if (!form.body.trim()) return setFormError("Escribí tu opinión");
    setSubmitting(true);
    setFormError("");
    try {
      await api.post(`/news/${newsletterId}/reviews/${newsIndex}`, form);
      setReviewSuccess(true);
      setForm((f) => ({ ...f, body: "" }));
      await loadReviews();
    } catch {
      setFormError("Error al guardar la opinión");
    } finally {
      setSubmitting(false);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: news.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-danger/30" style={{ background: "rgba(239,68,68,0.08)" }}>
            <span className="font-archivo text-3xl text-danger/60">!</span>
          </div>
          <div>
            <p className="font-grotesk font-bold text-lg text-text-primary">Noticia no encontrada</p>
            <p className="font-mono-jet text-[12px] text-text-muted mt-1">Esta noticia no existe o fue eliminada</p>
          </div>
          <button onClick={() => navigate(-1)} className="font-mono-jet text-[11px] border border-accent-purple/40 text-accent-purple px-5 py-2 rounded-lg hover:bg-accent-purple hover:text-white transition-colors">
            &#8592; Volver
          </button>
        </div>
      </div>
    );
  }

  const cat       = CATEGORY_COLORS[news.category] || CATEGORY_COLORS.DEFAULT;
  const readTime  = estimateReadTime(news);
  const relatedNews = allNews.filter((_, i) => i !== Number(newsIndex));

  return (
    <div className="min-h-screen bg-bg-primary page-enter">
      <ScrollProgressBar />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="font-mono-jet text-[11px] text-text-muted hover:text-accent-cyan transition-colors mb-6 flex items-center gap-1.5"
        >
          <span className="text-accent-cyan">&#8592;</span> Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main article column ── */}
          <article className="flex-1 min-w-0">
            {/* Hero image */}
            {news.image && (
              <div className="relative h-72 rounded-2xl overflow-hidden mb-6">
                <img src={news.image} alt={news.title} loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
              </div>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                className="font-mono-jet text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest"
                style={{ color: cat.text, background: cat.bg, borderColor: cat.border }}
              >
                {news.category}
              </span>
              {news.platform && (
                <span className="font-mono-jet text-[10px] text-text-muted border border-white/[0.1] rounded-full px-3 py-1">
                  {news.platform}
                </span>
              )}
              <span className="font-mono-jet text-[10px] text-text-muted border border-white/[0.08] rounded-full px-3 py-1">
                {readTime} min de lectura
              </span>
              {news.source && (
                <span className="font-mono-jet text-[10px] text-text-muted">
                  v&#237;a <span className="text-text-secondary">{news.source}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-archivo text-[clamp(26px,4vw,40px)] text-text-primary leading-tight mb-4">
              {news.title}
            </h1>

            {/* Description / lead */}
            <p className="text-lg text-accent-cyan font-medium leading-relaxed mb-8 border-l-2 border-accent-purple pl-4 italic">
              {news.description}
            </p>

            {/* Body */}
            <div className="flex flex-col gap-6">
              {(news.lead || news.fullDescription) && (
                <p className="text-base font-bold text-text-primary leading-relaxed">
                  {news.lead || news.fullDescription?.split("\n\n")?.[0] || ""}
                </p>
              )}
              {(news.body || news.fullDescription) && (() => {
                const bodyText = news.body
                  ? news.body
                  : news.fullDescription?.split("\n\n").slice(1, -1).join("\n\n") || "";
                return bodyText ? (
                  <div className="flex flex-col gap-4">
                    <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest border-b border-border-dark pb-2">Desarrollo</p>
                    {bodyText.split("\n\n").filter(Boolean).map((p, i) => (
                      <p key={i} className="text-text-secondary leading-relaxed text-base">{p}</p>
                    ))}
                  </div>
                ) : null;
              })()}
              {(news.closing || news.fullDescription) && (() => {
                const closingText = news.closing
                  ? news.closing
                  : news.fullDescription?.split("\n\n").slice(-1)[0] || "";
                const leadText = news.lead || news.fullDescription?.split("\n\n")?.[0] || "";
                if (!news.closing && closingText === leadText) return null;
                return closingText ? (
                  <div className="flex flex-col gap-2">
                    <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest border-b border-border-dark pb-2">Cierre</p>
                    <p className="text-text-secondary leading-relaxed text-base italic border-l-2 border-border-dark pl-4">{closingText}</p>
                  </div>
                ) : null;
              })()}
            </div>

            {/* External links — SVG icons */}
            {(news.url || news.reviewLinks?.length > 0) && (
              <div className="mt-8 p-4 rounded-xl border border-white/[0.08] flex flex-col gap-3" style={{ background: "rgba(26,26,46,0.5)" }}>
                <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest">Links relacionados</p>
                {news.url && (
                  <a href={news.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 font-mono-jet text-[12px] text-accent-cyan hover:underline group"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 opacity-60 group-hover:opacity-100">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Fuente original &#8212; {news.source || news.url}
                  </a>
                )}
                {news.reviewLinks?.map((rl, i) => (
                  <a key={i} href={rl.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 font-mono-jet text-[12px] text-accent-purple hover:underline group"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 opacity-60 group-hover:opacity-100">
                      <polygon points="3,2 11,7 3,12" fill="currentColor"/>
                    </svg>
                    {rl.label || rl.url}
                  </a>
                ))}
              </div>
            )}

            {/* Share button with inline toast */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleShare}
                className="relative flex items-center gap-2 font-mono-jet text-[11px] border rounded-xl px-4 py-2.5 transition-all duration-200"
                style={copied
                  ? { borderColor: "rgba(52,211,153,0.5)", color: "var(--success)", background: "rgba(52,211,153,0.08)" }
                  : { borderColor: "rgba(255,255,255,0.1)", color: "var(--text-muted)" }}
              >
                {copied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M1.5 6.5L5 10L11.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    &#161;Link copiado!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M8.5 1.5H11.5V4.5M11.5 1.5L7 6M5.5 3H2.5C1.95 3 1.5 3.45 1.5 4V10.5C1.5 11.05 1.95 11.5 2.5 11.5H9C9.55 11.5 10 11.05 10 10.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Compartir &#8599;
                  </>
                )}
              </button>
            </div>

            {/* ── Reviews section ── */}
            <div className="mt-12 pt-8 border-t border-white/[0.06]">
              <h2 className="font-grotesk font-bold text-xl text-text-primary flex items-center gap-3 mb-6">
                <span className="w-1.5 h-6 rounded-sm bg-accent-pink inline-block" style={{ boxShadow: "0 0 10px #ec4899" }} />
                Opiniones
                {reviews.length > 0 && (
                  <span className="font-mono-jet text-[11px] text-text-muted font-normal">/ {reviews.length}</span>
                )}
              </h2>

              {/* Form for auth users */}
              <div className="rounded-xl border border-white/[0.08] p-5 mb-6" style={{ background: "rgba(26,26,46,0.5)" }}>
                <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest mb-4">
                  {myRating ? "Tu opini&#243;n" : "Dejar opini&#243;n"}
                </p>
                {!isAuthenticated ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <p className="font-mono-jet text-[12px] text-text-secondary flex-1">
                      Inici&#225; sesi&#243;n para opinar sobre esta noticia.
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => navigate("/login")} className="font-mono-jet text-[11px] border border-accent-purple text-accent-purple px-4 py-2 rounded-lg hover:bg-accent-purple hover:text-white transition-colors">
                        Iniciar sesi&#243;n
                      </button>
                      <button onClick={() => navigate("/register")} className="font-mono-jet text-[11px] bg-accent-purple text-white px-4 py-2 rounded-lg hover:bg-accent-purple/80 transition-colors">
                        Registrarse
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {reviewSuccess && (
                      <div className="mb-4 p-3 rounded-xl border border-success/30 flex items-center gap-2.5" style={{ background: "rgba(52,211,153,0.08)" }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5L5 10L11.5 3" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="font-mono-jet text-[11px] text-success">Opini&#243;n guardada</span>
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
                        placeholder="&#191;Qu&#233; opinas de esta noticia?"
                        rows={3}
                        maxLength={400}
                        className="w-full rounded-xl px-4 py-3 font-mono-jet text-[12px] text-text-primary placeholder-text-muted/50 border border-white/[0.1] focus:outline-none focus:border-accent-pink focus:shadow-[0_0_0_3px_rgba(236,72,153,0.12)] resize-none transition-all"
                        style={{ background: "rgba(13,13,15,0.8)" }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-mono-jet text-[10px] text-text-muted">{form.body.length}/400</span>
                        {formError && <p className="font-mono-jet text-[10px] text-danger">{formError}</p>}
                      </div>
                      <button type="submit" disabled={submitting}
                        className="self-start font-mono-jet text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-xl text-white disabled:opacity-50 transition-all"
                        style={{ background: "linear-gradient(135deg, #ec4899, #7c3aed)", boxShadow: submitting ? "none" : "0 0 16px rgba(236,72,153,0.3)" }}
                      >
                        {submitting ? "Guardando&#8230;" : myRating ? "Actualizar" : "Publicar"}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Reviews list */}
              {reviews.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
              ) : (
                <p className="font-mono-jet text-[12px] text-text-muted text-center py-6">
                  Sin opiniones a&#250;n. &#161;S&#233; el primero!
                </p>
              )}
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
            {/* Game link card */}
            <button
              onClick={() => navigate(`/game/${slugify(news.title)}`, {
                state: { title: news.title, image: news.image, platform: news.platform },
              })}
              className="w-full text-left rounded-xl border border-white/[0.08] overflow-hidden hover:border-accent-purple transition-colors group"
              style={{ background: "rgba(26,26,46,0.5)" }}
            >
              {news.image && (
                <div className="h-40 overflow-hidden">
                  <img src={news.image} alt={news.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                  />
                </div>
              )}
              <div className="p-4 flex flex-col gap-1">
                <p className="font-mono-jet text-[10px] text-text-muted uppercase tracking-widest">Juego</p>
                <p className="font-grotesk font-bold text-sm text-text-primary leading-snug">{news.title}</p>
                {news.platform && <p className="font-mono-jet text-[10px] text-text-muted">{news.platform}</p>}
                <p className="font-mono-jet text-[10px] text-accent-purple mt-2 group-hover:underline">Ver reviews del juego &#8594;</p>
              </div>
            </button>
          </aside>
        </div>

        {/* ── Related articles from this edition ── */}
        {relatedNews.length > 0 && (
          <section className="mt-16 pt-8 border-t border-white/[0.06]">
            <h2 className="font-grotesk font-bold text-xl text-text-primary flex items-center gap-3 mb-6">
              <span className="w-1.5 h-6 rounded-sm bg-accent-cyan inline-block" style={{ boxShadow: "0 0 10px #06b6d4" }} />
              M&#225;s de esta edici&#243;n
              <span className="font-mono-jet text-[11px] text-text-muted font-normal">/ {relatedNews.length} noticias</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedNews.slice(0, 6).map((item, i) => {
                const origIdx = allNews.indexOf(item);
                const c = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.DEFAULT;
                return (
                  <button
                    key={origIdx}
                    onClick={() => navigate(`/news/${newsletterId}/${origIdx}`)}
                    className="text-left rounded-xl border border-white/[0.07] overflow-hidden hover:border-accent-cyan/40 transition-all duration-200 group opacity-0 animate-fade-up"
                    style={{ background: "rgba(26,26,46,0.5)", animationDelay: `${i * 0.06}s` }}
                  >
                    {item.image && (
                      <div className="h-28 overflow-hidden">
                        <img src={item.image} alt={item.title} loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                        />
                      </div>
                    )}
                    <div className="p-3 flex flex-col gap-1.5">
                      <span
                        className="font-mono-jet text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5 self-start border"
                        style={{ color: c.text, background: c.bg, borderColor: c.border }}
                      >
                        {item.category}
                      </span>
                      <p className="font-grotesk font-bold text-xs text-text-primary leading-snug line-clamp-2 group-hover:text-accent-cyan transition-colors">
                        {item.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BackToTop />
    </div>
  );
}
