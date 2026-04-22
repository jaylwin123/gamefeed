import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function History() {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-text-muted hover:text-text-primary transition-colors mb-4 flex items-center gap-1"
          >
            ← Volver al feed
          </button>
          <h1 className="text-2xl font-black text-text-primary">
            Archivo de ediciones
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Todas las ediciones publicadas
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-accent-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {editions.map((ed) => (
              <button
                key={ed.id}
                onClick={() => navigate(`/edition/${ed.id}`)}
                className="bg-bg-card border border-border-dark rounded-xl p-5 text-left hover:border-accent-purple hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 flex items-center justify-between group"
              >
                <div>
                  <span className="text-lg font-black text-text-primary group-hover:text-accent-cyan transition-colors">
                    Edición{" "}
                    <span className="text-accent-purple">#{ed.edition}</span>
                  </span>
                  <p className="text-xs text-text-muted mt-1 capitalize">
                    {formattedDate(ed.date)}
                  </p>
                </div>
                <span className="text-text-muted group-hover:text-accent-purple transition-colors text-lg">
                  →
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
