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

const STRENGTH_META = [
  { label: "", color: "" },
  { label: "Muy débil", color: "#ef4444" },
  { label: "Débil",     color: "#f59e0b" },
  { label: "Regular",   color: "#f59e0b" },
  { label: "Fuerte",    color: "#34d399" },
  { label: "Muy fuerte",color: "#34d399" },
];

const REQUIREMENTS = [
  { key: "length",    label: "Mínimo 8 caracteres" },
  { key: "uppercase", label: "Al menos 1 mayúscula" },
  { key: "lowercase", label: "Al menos 1 minúscula" },
  { key: "number",    label: "Al menos 1 número" },
  { key: "special",   label: "Al menos 1 especial (!@#$%^&*)" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const { score, checks } = getPasswordStrength(form.password);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm)
      return setError("Todos los campos son requeridos");
    if (form.password !== form.confirm)
      return setError("Las contraseñas no coinciden");
    if (score < 5)
      return setError("La contraseña no cumple todos los requisitos de seguridad");

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl px-4 py-3 font-mono-jet text-[13px] text-text-primary placeholder-text-muted/50 border border-white/[0.1] focus:outline-none focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all";
  const inputStyle = { background: "rgba(13,13,15,0.8)" };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-8 page-enter">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div
            className="relative w-12 h-12 rounded-[12px]"
            style={{
              background: "conic-gradient(from 180deg, #7c3aed, #06b6d4, #ec4899, #f59e0b, #7c3aed)",
              boxShadow: "0 0 32px rgba(124,58,237,0.5)",
            }}
          >
            <div
              className="absolute inset-[4px] rounded-[8px] flex items-center justify-center text-base text-white font-bold"
              style={{ background: "var(--bg-primary)" }}
            >
              &#9654;
            </div>
          </div>
          <div className="font-archivo text-[30px] tracking-tight flex items-baseline gap-2">
            <span className="text-white">GAME</span>
            <span className="glow-cyan">FEED</span>
          </div>
          <p className="font-mono-jet text-[11px] text-text-muted tracking-[0.2em] uppercase">
            &#218;nete al noticiero gaming
          </p>
        </div>

        {/* Card */}
        <div
          className="relative rounded-2xl border border-white/[0.1] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(26,26,46,0.95), rgba(21,21,42,0.9))",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(124,58,237,0.12), 0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #ec4899 40%, #7c3aed 70%, transparent)" }}
          />

          <div className="p-8">
            {/* Success state */}
            {success ? (
              <div className="flex flex-col items-center gap-5 py-6 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border border-success/30"
                  style={{ background: "rgba(52,211,153,0.1)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14L11 20L23 8" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-grotesk font-bold text-xl text-text-primary">&#161;Cuenta creada!</p>
                  <p className="font-mono-jet text-[12px] text-text-muted mt-1.5">
                    Redirigiendo al login en un momento…
                  </p>
                </div>
                <div className="w-32 h-1 rounded-full bg-border-dark overflow-hidden">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ animation: "bar-fill 2.4s ease-out forwards" }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-grotesk font-bold text-2xl text-text-primary">Crear cuenta</h2>
                  <p className="font-mono-jet text-[11px] text-text-muted mt-1.5 tracking-widest uppercase">
                    Gratis para siempre
                  </p>
                </div>

                {error && (
                  <div
                    className="mb-5 p-3.5 rounded-xl border border-danger/30 flex items-start gap-3 text-sm"
                    style={{ background: "rgba(239,68,68,0.08)" }}
                  >
                    <span className="text-danger/70 mt-0.5 flex-shrink-0 font-bold">!</span>
                    <span className="text-danger">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Username */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono-jet text-[11px] text-text-muted uppercase tracking-widest">
                      Nombre de usuario
                    </label>
                    <input
                      type="text" name="username" value={form.username}
                      onChange={handleChange} placeholder="GamerPro123"
                      autoComplete="username"
                      className={inputClass} style={inputStyle}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono-jet text-[11px] text-text-muted uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="tu@email.com"
                      autoComplete="email"
                      className={inputClass} style={inputStyle}
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono-jet text-[11px] text-text-muted uppercase tracking-widest">
                      Contrase&#241;a
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password" value={form.password}
                        onChange={handleChange}
                        placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                        autoComplete="new-password"
                        className={inputClass + " pr-12"} style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 2L14 14M6.5 6.7A2 2 0 0 0 9.3 9.5M3.4 4.2C2.3 5.1 1.4 6.4 1 8c1 3.3 4 5.5 7 5.5a7 7 0 0 0 3.1-.7M6 2.8A7 7 0 0 1 8 2.5c3 0 6 2.2 7 5.5-.3 1-.8 2-1.5 2.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8C2 4.7 5 2.5 8 2.5s6 2.2 7 5.5c-1 3.3-4 5.5-7 5.5S2 11.3 1 8Z" stroke="currentColor" strokeWidth="1.4"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {form.password && (
                      <div className="mt-1.5">
                        <div className="flex gap-1 mb-1.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-all duration-300"
                              style={{
                                background: i <= score ? STRENGTH_META[score].color : "rgba(45,45,78,1)",
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-mono-jet text-[10px]" style={{ color: STRENGTH_META[score].color || "var(--text-muted)" }}>
                            {STRENGTH_META[score].label}
                          </p>
                          <p className="font-mono-jet text-[10px] text-text-muted">{score}/5</p>
                        </div>
                        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
                          {REQUIREMENTS.map(({ key, label }) => (
                            <li
                              key={key}
                              className="font-mono-jet text-[10px] flex items-center gap-1 transition-colors"
                              style={{ color: checks[key] ? "#34d399" : "var(--text-muted)" }}
                            >
                              <span>{checks[key] ? "✓" : "○"}</span>
                              {label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono-jet text-[11px] text-text-muted uppercase tracking-widest">
                      Confirmar contrase&#241;a
                    </label>
                    <input
                      type="password" name="confirm" value={form.confirm}
                      onChange={handleChange}
                      placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                      autoComplete="new-password"
                      className={inputClass + (form.confirm && form.password !== form.confirm ? " border-danger/50" : "")}
                      style={inputStyle}
                    />
                    {form.confirm && form.password !== form.confirm && (
                      <p className="font-mono-jet text-[10px] text-danger">Las contraseñas no coinciden</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3.5 rounded-xl font-mono-jet text-[12px] uppercase tracking-[0.15em] font-bold text-white transition-all duration-200 mt-1 disabled:opacity-50 overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                      boxShadow: loading ? "none" : "0 0 24px rgba(236,72,153,0.35)",
                    }}
                  >
                    <span className="relative z-10">
                      {loading ? "Creando cuenta…" : "Crear cuenta →"}
                    </span>
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #db2777, #6d28d9)" }}
                    />
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                  <p className="font-mono-jet text-[11px] text-text-muted">
                    &#191;Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-accent-cyan hover:text-accent-purple transition-colors font-medium">
                      Inicia sesi&#243;n
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center font-mono-jet text-[10px] text-text-muted/40 mt-6 tracking-widest">
          GAMEFEED &#183; DAILY GAMING NEWSLETTER
        </p>
      </div>
    </div>
  );
}
