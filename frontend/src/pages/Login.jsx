import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Register from "./Register";

function Login() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isRegister) return <Register onSwitch={() => setIsRegister(false)} />;

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useState(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="auth-card animate-fadeIn">
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <h1 className="shimmer-text" style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.04em" }}>
            Vyntra
          </h1>
          <p style={{ color: "var(--text-info)", fontSize: "0.95rem", marginTop: 8, fontWeight: 500 }}>
            Welcome back — sign in to your accounts
          </p>
        </div>

        <form onSubmit={handleLogin} className="glass-strong" style={{ borderRadius: 24, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20, boxShadow: "var(--shadow-md)" }}>
          {error && <div className="alert-error animate-fadeIn">{error}</div>}

          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="label">Password</label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", color: "var(--accent)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", padding: "0 4px" }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><span className="spinner" />Signing in…</> : "Sign In"}
          </button>

          <div style={{ margin: "12px 0", display: "flex", alignItems: "center", gap: 12 }}>
             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
             <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>OR</span>
             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-info)" }}>
            New to Vyntra?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 700, cursor: "pointer", fontSize: "inherit", padding: "0 2px" }}
            >
              Create an account
            </button>
          </p>
        </form>
        
        <p style={{ marginTop: 24, fontSize: "0.8rem", color: "var(--text-muted)" }}>
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Login;