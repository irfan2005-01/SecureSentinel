import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import api, { setAuthSession } from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.warning("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        username: username.trim(),
        password,
      });

      setAuthSession(res.data.access_token, res.data.user);
      toast.success(`Welcome back, ${res.data.user?.full_name || res.data.user?.username || username}!`);
      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail || "Invalid username or password";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-badge">
          <Shield size={13} /> ZERO-TRUST PORTAL
        </div>
        <h1>Operator Authentication</h1>
        <p>Enterprise Integrity Monitoring & Multi-Cloud Evidence Vault</p>

        <div className="form-group">
          <label>Operator Handle / Username</label>
          <div className="input-password-wrapper">
            <input
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Security Key / Password</label>
          <div className="input-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Authenticating..." : (
            <>
              Sign In to Console <ArrowRight size={16} />
            </>
          )}
        </button>

        <div className="auth-footer-links">
          <span>Need operator access? </span>
          <Link to="/register" className="auth-link">Register Account</Link>
        </div>

        <div className="default-creds-hint">
          <small>Default Root Access: <code>admin</code> / <code>admin123</code></small>
        </div>
      </form>
    </div>
  );
}

export default Login;
