import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function getPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks };
}

const STRENGTH_LABELS = [
  "",
  "Muy débil",
  "Débil",
  "Regular",
  "Fuerte",
  "Muy fuerte",
];
const STRENGTH_BAR_COLORS = [
  "",
  "bg-danger",
  "bg-accent-yellow",
  "bg-accent-yellow",
  "bg-success",
  "bg-success",
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { score, checks } = getPasswordStrength(form.password);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm) {
      return setError("Todos los campos son requeridos");
    }
    if (form.password !== form.confirm) {
      return setError("Las contraseñas no coinciden");
    }
    if (score < 5) {
      return setError(
        "La contraseña no cumple todos los requisitos de seguridad",
      );
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  const REQUIREMENTS = [
    { key: "length", label: "Mínimo 8 caracteres" },
    { key: "uppercase", label: "Al menos 1 mayúscula" },
    { key: "lowercase", label: "Al menos 1 minúscula" },
    { key: "number", label: "Al menos 1 número" },
    { key: "special", label: "Al menos 1 especial (!@#$%^&*)" },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-widest bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
            GAMEFEED
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Únete al noticiero gaming
          </p>
        </div>

        <div className="bg-bg-card border border-border-dark rounded-2xl p-8 shadow-[0_0_40px_rgba(124,58,237,0.1)]">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Crear cuenta
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="GamerPro123"
                autoComplete="username"
                className="w-full bg-bg-primary border border-border-dark rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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
                  autoComplete="new-password"
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

              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i <= score
                            ? STRENGTH_BAR_COLORS[score]
                            : "bg-border-dark"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">
                    {STRENGTH_LABELS[score]}
                  </p>
                </div>
              )}

              {/* Requirements list */}
              {form.password && (
                <ul className="mt-2 space-y-1">
                  {REQUIREMENTS.map(({ key, label }) => (
                    <li
                      key={key}
                      className={`text-xs flex items-center gap-1.5 transition-colors ${
                        checks[key] ? "text-success" : "text-text-muted"
                      }`}
                    >
                      <span>{checks[key] ? "✓" : "○"}</span>
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-bg-primary border border-border-dark rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-danger mt-1.5">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-accent-purple to-accent-cyan hover:opacity-90 disabled:opacity-50 transition-all duration-200 mt-2"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-accent-cyan hover:text-accent-purple transition-colors font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
