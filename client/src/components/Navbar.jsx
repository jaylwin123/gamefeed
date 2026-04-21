import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ edition }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary border-b border-border-dark px-6 py-3 flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
          GAMEFEED
        </span>
        {edition && (
          <span className="text-xs text-text-muted border border-border-dark rounded px-2 py-1 font-mono">
            Edición #{edition}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-text-secondary hidden sm:block">
            Hola,{" "}
            <span className="text-accent-cyan font-semibold">
              {user.username}
            </span>{" "}
            👋
          </span>
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
