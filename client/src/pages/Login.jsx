import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email) return setError("El email es requerido");
    if (!form.password) return setError("La contraseña es requerida");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-widest bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
            GAMEFEED
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Tu noticiero gaming en español
          </p>
        </div>

        <div className="bg-bg-card border border-border-dark rounded-2xl p-8 shadow-[0_0_40px_rgba(124,58,237,0.1)]">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Iniciar sesión
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                autoComplete="email"
                className="w-full bg-bg-primary border border-border-dark rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-bg-primary border border-border-dark rounded-lg px-4 py-3 pr-12 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors text-lg"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-accent-purple to-accent-cyan hover:opacity-90 disabled:opacity-50 transition-all duration-200 mt-2"
            >
              {loading ? "Iniciando..." : "Entrar al Feed"}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-accent-cyan hover:text-accent-purple transition-colors font-medium"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
