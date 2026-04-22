import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border-dark mt-16 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display text-3xl tracking-widest bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
            GAMEFEED
          </p>
          <p className="text-xs text-text-muted mt-1">
            Tu newsletter diario de gaming en español
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs text-text-muted">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:text-accent-cyan transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/history")}
            className="hover:text-accent-cyan transition-colors"
          >
            Archivo
          </button>
        </div>
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} GAMEFEED
        </p>
      </div>
    </footer>
  );
}
