import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { SentinelIcon } from "../components/Logo";
import api, { setAuthSession } from "../services/api";
import "../styles/Login.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      toast.warning("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        password,
      });

      setAuthSession(res.data.access_token, res.data.user);
      toast.success("Account created successfully! Welcome to SecureSentinel.");
      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail || "Registration failed";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Background Animated Cyber Visuals & Radar */}
      <div className="login-radar-bg">
        <div className="radar-circle radar-circle-1"></div>
        <div className="radar-circle radar-circle-2"></div>
        <div className="radar-circle radar-circle-3"></div>
        <div className="radar-circle radar-circle-4"></div>
        <div className="radar-sweep"></div>
        <div className="glow-orb glow-orb-gold"></div>
        <div className="glow-orb glow-orb-emerald"></div>
      </div>
      <div className="login-grid-overlay"></div>

      {/* Top Tactical Header Bar */}
      <div className="login-top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SentinelIcon size={18} />
          <strong style={{ color: "var(--primary)" }}>SECURESENTINEL ONBOARDING</strong>
          <span>• PROTOCOL V4.2</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--secondary)" }}>[■] SECURE ENCLAVE OPEN</span>
        </div>
      </div>

      <form className="login-card" onSubmit={handleRegister} style={{ maxWidth: "480px" }}>
        <div className="login-badge">
          <Shield size={12} /> OPERATOR ONBOARDING
        </div>
        <h1>Create Operator Account</h1>
        <p>Register new cryptographic vault administrator credentials</p>

        <div className="form-group">
          <label>Operator Handle (Username) *</label>
          <input
            placeholder="e.g. jdoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Alert Notification Email *</label>
          <input
            type="email"
            placeholder="operator@securesentinel.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Operator Display Name</label>
          <input
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password (Min. 6 chars) *</label>
          <div className="input-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Creating Account..." : (
            <>
              Initialize Account & Vault <ArrowRight size={15} />
            </>
          )}
        </button>

        <div className="auth-footer-links">
          <span>Already have an operator account? </span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </form>

      {/* Bottom HUD Status Strip */}
      <div className="login-bottom-strip">
        <div>SECURESENTINEL SOC ARCHITECTURE • ZERO RAW PAYLOAD EXPOSURE</div>
        <div style={{ color: "var(--primary)" }}>CLASSIFICATION: UNCLASSIFIED / OPERATIONAL</div>
      </div>
    </div>
  );
}

export default Register;

