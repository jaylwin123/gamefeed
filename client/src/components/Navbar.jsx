import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ edition }) {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary border-b border-border-dark px-6 py-3 flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-black tracking-widest bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          GAMEFEED
        </button>
        {edition && (
          <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1 font-mono">
            Edición #{edition}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {location.pathname !== "/history" && (
          <button
            onClick={() => navigate("/history")}
            className="text-xs text-text-muted hover:text-accent-cyan transition-colors hidden sm:block"
          >
            Archivo
          </button>
        )}
        <button
          onClick={toggleDark}
          className="text-lg hover:scale-110 transition-transform"
          title={dark ? "Modo claro" : "Modo oscuro"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-purple/20 border border-accent-purple/50 flex items-center justify-center text-xs font-bold text-accent-purple flex-shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-sm text-text-secondary hidden sm:block">
              <span className="text-accent-cyan font-semibold">
                {user.username}
              </span>
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-xs border border-accent-purple text-accent-purple px-3 py-1.5 rounded hover:bg-accent-purple hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
