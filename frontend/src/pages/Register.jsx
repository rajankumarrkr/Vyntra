import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register({ onSwitch }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", { username, email, password });
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1" style={{ animationDelay: "-3s" }} />
      <div className="blob blob-2" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">✦</div>
          <h1 className="shimmer-text" style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em" }}>
            Vyntra
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.875rem", marginTop: 6 }}>
            Join the community — create your account
          </p>
        </div>

        <form onSubmit={handleRegister} className="glass-strong" style={{ borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
          {error && <div className="alert-error animate-fadeIn">{error}</div>}

          <div>
            <label className="label">Username</label>
            <input
              placeholder="yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input"
            />
          </div>

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
            {loading ? <><span className="spinner" />Creating account…</> : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text3)" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              style={{ background: "none", border: "none", color: "#a78bfa", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;