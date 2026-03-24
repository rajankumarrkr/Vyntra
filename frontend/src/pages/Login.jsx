import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import Register from "./Register";

function Login() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isRegister) return <Register onSwitch={() => setIsRegister(false)} />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <h1 className="shimmer-text" style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Vyntra
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.875rem", marginTop: 6 }}>
            Welcome back — sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="glass-strong" style={{ borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
          {error && <div className="alert-error animate-fadeIn">{error}</div>}

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><span className="spinner" />Signing in…</> : "Sign In"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text3)" }}>
            New here?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              style={{ background: "none", border: "none", color: "#a78bfa", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}
            >
              Create an account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;