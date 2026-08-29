import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import api, { setAuthSession } from "../services/api";
import "../styles/Login.css";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
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
        organization: organization.trim(),
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
      <form className="login-card" onSubmit={handleRegister} style={{ maxWidth: "500px" }}>
        <div className="login-badge">
          <Shield size={13} /> OPERATOR ONBOARDING
        </div>
        <h1>Create Operator Account</h1>
        <p>Register new cryptographic vault administrator credentials</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="form-group">
            <label>Username *</label>
            <input
              placeholder="e.g. jdoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="operator@sentinel.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Organization</label>
            <input
              placeholder="Cyber Operations"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>
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
              Initialize Account & Vault <ArrowRight size={16} />
            </>
          )}
        </button>

        <div className="auth-footer-links">
          <span>Already have an operator account? </span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
