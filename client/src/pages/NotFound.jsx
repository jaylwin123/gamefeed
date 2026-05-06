import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 page-enter">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 400px at 50% 40%, rgba(124,58,237,0.1), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 text-center max-w-md">
        {/* Glitchy 404 */}
        <div className="relative select-none">
          <div
            className="font-archivo leading-none"
            style={{
              fontSize: "clamp(100px, 22vw, 180px)",
              background: "linear-gradient(180deg, #fff 10%, #7c3aed 90%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 80px rgba(124,58,237,0.3)",
            }}
          >
            404
          </div>
          <div
            className="absolute inset-0 font-archivo leading-none opacity-20 pointer-events-none"
            style={{
              fontSize: "clamp(100px, 22vw, 180px)",
              color: "#06b6d4",
              transform: "translate(3px, -2px)",
              WebkitTextFillColor: "#06b6d4",
            }}
          >
            404
          </div>
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-accent-purple/30"
          style={{ background: "rgba(124,58,237,0.1)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4M12 17h.01M5.07 19H19a2 2 0 0 0 1.73-3L13.73 4a2 2 0 0 0-3.46 0L4.27 16a2 2 0 0 0 1.8 3Z"
              stroke="#7c3aed"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h1 className="font-grotesk font-bold text-2xl text-text-primary mb-2">
            P&#225;gina no encontrada
          </h1>
          <p className="font-mono-jet text-[12px] text-text-muted leading-relaxed">
            La URL que buscas no existe o fue eliminada.
            <br />
            Vuelve al feed para no perderte nada.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="font-mono-jet text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-xl text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              boxShadow: "0 0 20px rgba(124,58,237,0.35)",
            }}
          >
            &#8592; Ir al feed
          </button>
          <button
            onClick={() => navigate(-1)}
            className="font-mono-jet text-[11px] uppercase tracking-widest px-6 py-2.5 rounded-xl border border-white/[0.12] text-text-muted hover:border-accent-purple/40 hover:text-accent-purple transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            Volver atr&#225;s
          </button>
        </div>

        <p className="font-mono-jet text-[10px] text-text-muted/40 tracking-widest uppercase">
          GAMEFEED &#183; Error 404
        </p>
      </div>
    </div>
  );
}
