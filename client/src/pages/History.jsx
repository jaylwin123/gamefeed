import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import api from "../api/axios";

export default function History() {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/news/history")
      .then((res) => setEditions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const formattedDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
      "es-ES",
      { weekday: "short", year: "numeric", month: "long", day: "numeric" },
    );
  };

  const filtered = editions.filter((ed) =>
    `#${ed.edition} ${formattedDate(ed.date)}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-text-muted hover:text-accent-cyan transition-colors mb-5 flex items-center gap-1.5 font-mono-jet"
          >
            <span className="text-accent-cyan">←</span> Volver al feed
          </button>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono-jet text-[11px] text-text-muted tracking-[0.25em] uppercase mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-accent-purple inline-block" />
                GameFeed · Archivo
              </div>
              <h1 className="font-archivo text-4xl text-text-primary leading-tight">
                Todas las{" "}
                <span
                  className="glow-purple"
                  style={{ WebkitTextFillColor: "#7c3aed" }}
                >
                  Ediciones
                </span>
              </h1>
              <p className="font-mono-jet text-[13px] text-text-muted mt-2">
                {loading ? "—" : `${editions.length} ediciones publicadas`}
              </p>
            </div>

            {/* Search */}
            {!loading && editions.length > 0 && (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-mono-jet text-[12px] pointer-events-none">
                  /
                </span>
                <input
                  type="text"
                  placeholder="Buscar edición..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-52 pl-7 pr-4 py-2.5 rounded-lg bg-bg-card border border-border-dark text-text-primary font-mono-jet text-[12px] placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary font-mono-jet text-[11px] transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          <div
            className="mt-6 h-px"
            style={{
              background:
                "linear-gradient(90deg, #7c3aed, rgba(6,182,212,0.4), transparent)",
              boxShadow: "0 0 8px rgba(124,58,237,0.4)",
            }}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[72px] rounded-xl bg-bg-card animate-pulse"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
              }}
            >
              <span className="font-archivo text-3xl text-text-muted">?</span>
            </div>
            <p className="font-grotesk font-bold text-text-primary text-lg">
              Sin resultados
            </p>
            <p className="font-mono-jet text-[12px] text-text-muted text-center max-w-xs">
              No se encontraron ediciones que coincidan con &ldquo;{search}&rdquo;
            </p>
            <button
              onClick={() => setSearch("")}
              className="font-mono-jet text-[11px] text-accent-cyan hover:underline mt-1"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((ed, idx) => (
              <button
                key={ed.id}
                onClick={() => navigate(`/edition/${ed.id}`)}
                className="group relative text-left rounded-xl border border-white/[0.07] overflow-hidden transition-all duration-200 hover:border-accent-purple/50 hover:shadow-[0_0_24px_rgba(124,58,237,0.15)] opacity-0 animate-fade-up"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(26,26,46,0.7), rgba(21,21,42,0.5))",
                  animationDelay: `${idx * 0.04}s`,
                }}
              >
                {/* Left accent bar on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl"
                  style={{
                    background:
                      "linear-gradient(180deg, #7c3aed, #06b6d4)",
                  }}
                />
                <div className="flex items-center justify-between px-5 py-4 pl-6">
                  <div className="flex items-center gap-5">
                    {/* Edition number */}
                    <div
                      className="font-archivo text-2xl leading-none tabular-nums flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #c4b5fd, #7c3aed)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      #{ed.edition}
                    </div>

                    <div>
                      <p className="font-grotesk font-bold text-sm text-text-primary group-hover:text-accent-cyan transition-colors">
                        Edición {ed.edition}
                      </p>
                      <p className="font-mono-jet text-[11px] text-text-muted capitalize mt-0.5">
                        {formattedDate(ed.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="font-mono-jet text-[10px] px-2.5 py-1 rounded-full border hidden sm:inline"
                      style={{
                        borderColor: "rgba(124,58,237,0.25)",
                        color: "var(--text-muted)",
                        background: "rgba(124,58,237,0.06)",
                      }}
                    >
                      VER
                    </span>
                    <span className="text-text-muted group-hover:text-accent-purple transition-colors font-mono-jet text-base">
                      &#8594;
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Result count when searching */}
        {search && filtered.length > 0 && (
          <p className="font-mono-jet text-[11px] text-text-muted mt-4 text-center">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &ldquo;{search}&rdquo;
          </p>
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
