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
      setError(err.response?.data?.error || "Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 page-enter">
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10 gap-3">
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
            Tu noticiero gaming en espa&#241;ol
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
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #7c3aed 40%, #06b6d4 70%, transparent)" }}
          />

          <div className="p-8">
            <div className="mb-7">
              <h2 className="font-grotesk font-bold text-2xl text-text-primary">Iniciar sesi&#243;n</h2>
              <p className="font-mono-jet text-[11px] text-text-muted mt-1.5 tracking-widest uppercase">
                Accede al feed diario
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono-jet text-[11px] text-text-muted uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className="w-full rounded-xl px-4 py-3 font-mono-jet text-[13px] text-text-primary placeholder-text-muted/50 border border-white/[0.1] focus:outline-none focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all"
                  style={{ background: "rgba(13,13,15,0.8)" }}
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
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                    autoComplete="current-password"
                    className="w-full rounded-xl px-4 py-3 pr-12 font-mono-jet text-[13px] text-text-primary placeholder-text-muted/50 border border-white/[0.1] focus:outline-none focus:border-accent-purple focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] transition-all"
                    style={{ background: "rgba(13,13,15,0.8)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors rounded"
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
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl font-mono-jet text-[12px] uppercase tracking-[0.15em] font-bold text-white transition-all duration-200 mt-1 disabled:opacity-50 overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  boxShadow: loading ? "none" : "0 0 24px rgba(124,58,237,0.4)",
                }}
              >
                <span className="relative z-10">
                  {loading ? "Iniciando…" : "Entrar al Feed →"}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #6d28d9, #0891b2)" }}
                />
              </button>
            </form>

            <div className="mt-7 pt-5 border-t border-white/[0.06] text-center">
              <p className="font-mono-jet text-[11px] text-text-muted">
                &#191;No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-accent-cyan hover:text-accent-purple transition-colors font-medium"
                >
                  Reg&#237;strate gratis
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom tag */}
        <p className="text-center font-mono-jet text-[10px] text-text-muted/40 mt-6 tracking-widest">
          GAMEFEED &#183; DAILY GAMING NEWSLETTER
        </p>
      </div>
    </div>
  );
}
