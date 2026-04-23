import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="mt-16"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-[6px]"
            style={{
              background:
                "conic-gradient(from 135deg, #7c3aed, #06b6d4, #ec4899, #7c3aed)",
            }}
          />
          <span className="font-archivo text-lg tracking-wider">
            <span className="text-text-primary">GAME</span>
            <span className="glow-cyan" style={{ color: "#06b6d4" }}>
              FEED
            </span>
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5 flex-wrap justify-center">
          {[
            { label: "Archivo", path: "/history" },
            { label: "Suscribirme", path: "/register" },
            { label: "Dashboard", path: "/dashboard" },
            { label: "Contacto", href: "mailto:hola@gamefeed.news" },
          ].map(({ label, path, href }) =>
            href ? (
              <a
                key={label}
                href={href}
                className="font-mono-jet text-[11px] text-text-muted uppercase tracking-widest hover:text-accent-cyan transition-colors"
              >
                {label}
              </a>
            ) : (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="font-mono-jet text-[11px] text-text-muted uppercase tracking-widest hover:text-accent-cyan transition-colors"
              >
                {label}
              </button>
            ),
          )}
        </nav>

        {/* Copyright */}
        <p className="font-mono-jet text-[11px] text-text-muted text-center sm:text-right">
          © {new Date().getFullYear()} GAMEFEED · Daily gaming newsletter
          <br className="hidden sm:block" />
          <span className="sm:ml-0"> Edición diaria 13:00 UTC</span>
        </p>
      </div>
    </footer>
  );
}
