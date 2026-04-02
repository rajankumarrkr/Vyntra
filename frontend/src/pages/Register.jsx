import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register({ onSwitch }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", { username, email, password });
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1" style={{ animationDelay: "-3s" }} />
      <div className="blob blob-2" />

      <div className="auth-card animate-fadeIn">
        <div className="auth-header">
           <div className="auth-logo-icon">✦</div>
           <h1 className="shimmer-text" style={{ fontSize: "2.5rem", fontWeight: 900 }}>Vyntra</h1>
           <p style={{ color: "var(--text-info)", fontSize: "0.95rem", marginTop: 8 }}>
             Join the community — create your account
           </p>
        </div>

        <form onSubmit={handleRegister} className="glass-strong" style={{ borderRadius: 24, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20, boxShadow: "var(--shadow-md)" }}>
          {error && <div className="alert-error animate-fadeIn">{error}</div>}

          <div className="form-group">
            <label className="label">Username</label>
            <input
              placeholder="choose_a_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
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
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
             {loading ? <><span className="spinner" />Creating account…</> : "Create Account"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-info)" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitch}
              style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 700, cursor: "pointer", fontSize: "inherit", padding: "0 4px" }}
            >
              Sign in
            </button>
          </p>
        </form>
        
        <p style={{ marginTop: 24, fontSize: "0.8rem", color: "var(--text-muted)" }}>
          By creating an account, you agree to our Terms and Data Policy.
        </p>
      </div>
    </div>
  );
}

export default Register;