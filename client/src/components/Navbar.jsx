import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { label: "Feed", path: "/dashboard" },
  { label: "Archivo", path: "/history" },
];

export default function Navbar({ edition }) {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function navTo(path) {
    setMobileOpen(false);
    navigate(path);
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/[0.06]"
      style={{
        background: "rgba(13,13,15,0.72)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* Logo */}
        <button
          onClick={() => navTo("/dashboard")}
          className="flex items-center gap-3 flex-shrink-0"
        >
          <div
            className="relative w-[34px] h-[34px] rounded-[8px] flex-shrink-0"
            style={{
              background:
                "conic-gradient(from 180deg, #7c3aed, #06b6d4, #ec4899, #f59e0b, #7c3aed)",
              boxShadow: "0 0 24px rgba(124,58,237,0.55)",
            }}
          >
            <div
              className="absolute inset-[3px] rounded-[5px] flex items-center justify-center text-xs text-white font-bold z-10"
              style={{ background: "var(--bg-primary)" }}
            >
              &#9654;
            </div>
          </div>
          <div className="font-archivo text-[22px] tracking-tight flex items-baseline gap-1.5">
            <span className="text-white">GAME</span>
            <span className="glow-cyan">FEED</span>
          </div>
          {edition && (
            <span
              className="font-mono-jet text-[11px] text-text-muted border border-white/[0.12] rounded-md px-2.5 py-1 hidden sm:inline"
              style={{
                background:
                  "linear-gradient(180deg, rgba(124,58,237,0.10), rgba(124,58,237,0))",
              }}
            >
              ED <b className="text-accent-purple">#{edition}</b>
            </span>
          )}
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 ml-auto font-mono-jet text-xs">
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navTo(path)}
              className={`relative px-3 py-1.5 rounded-md transition-all ${
                location.pathname === path
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-white/[0.04]"
              }`}
            >
              {label}
              {location.pathname === path && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent-purple"
                  style={{ boxShadow: "0 0 10px #7c3aed" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5 ml-auto md:ml-0">
          <button
            onClick={toggleDark}
            className="w-[34px] h-[34px] grid place-items-center border border-white/[0.12] rounded-lg text-text-muted hover:text-text-primary hover:border-accent-cyan transition-all text-base"
            title={dark ? "Modo claro" : "Modo oscuro"}
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <>
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-archivo text-white cursor-pointer flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                  boxShadow: "0 0 0 2px #0d0d0f, 0 0 0 3px #ec4899",
                }}
                title={user.username}
              >
                {user.username[0].toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="font-mono-jet text-[11px] border border-accent-purple/40 text-accent-purple px-3 py-1.5 rounded-lg hover:bg-accent-purple hover:text-white transition-colors hidden sm:block"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navTo("/login")}
                className="font-mono-jet text-[11px] text-text-muted hover:text-text-primary transition-colors hidden sm:block"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navTo("/register")}
                className="font-mono-jet text-[11px] bg-accent-purple text-white px-3 py-1.5 rounded-lg hover:bg-accent-purple/80 transition-colors hidden sm:block"
              >
                Registrarse
              </button>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-[34px] h-[34px] grid place-items-center border border-white/[0.12] rounded-lg text-text-muted hover:text-text-primary hover:border-accent-purple transition-all"
            aria-label="Menú"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/[0.06] px-6 py-4 flex flex-col gap-1"
          style={{ background: "rgba(13,13,15,0.96)" }}
        >
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navTo(path)}
              className={`w-full text-left font-mono-jet text-sm px-3 py-2.5 rounded-lg transition-all ${
                location.pathname === path
                  ? "text-text-primary bg-accent-purple/10 border border-accent-purple/30"
                  : "text-text-muted hover:text-text-primary hover:bg-white/[0.04]"
              }`}
            >
              {label}
            </button>
          ))}

          <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
            {user ? (
              <>
                <div className="font-mono-jet text-[11px] text-text-muted px-3">
                  Conectado como{" "}
                  <span className="text-accent-cyan">{user.username}</span>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full text-left font-mono-jet text-sm px-3 py-2.5 rounded-lg text-danger hover:bg-danger/10 transition-all"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navTo("/login")}
                  className="w-full text-left font-mono-jet text-sm px-3 py-2.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-all"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navTo("/register")}
                  className="w-full font-mono-jet text-sm px-3 py-2.5 rounded-lg bg-accent-purple text-white hover:bg-accent-purple/80 transition-all"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
