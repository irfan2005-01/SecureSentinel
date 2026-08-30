import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  Terminal,
  Cpu,
  Lock,
  Zap,
  Globe,
  Radio,
} from "lucide-react";
import api, { setAuthSession } from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeStr, setTimeStr] = useState(new Date().toUTCString());

  // Simulated rolling stream for right HUD
  const [streamFeed, setStreamFeed] = useState([
    { id: 1, text: "PDP_AUDIT_CYCLE_INIT", hash: "9f86d081884c7d659a2f... OK" },
    { id: 2, text: "MERKLE_PROOF_ANCHORED", hash: "e3b0c44298fc1c149afb... SYNC" },
    { id: 3, text: "NODE_08_DRIFT_SCAN", hash: "4b227777d4dd1fc61c6f... 0 DRIFT" },
  ]);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTimeStr(new Date().toUTCString());
    }, 1000);

    const streamInterval = setInterval(() => {
      const actions = [
        "PDP_VERIFY_CHALLENGE",
        "VAULT_HASH_REPLICATED",
        "CRYPTO_SEED_VALIDATED",
        "ZERO_KNOWLEDGE_PROOF_OK",
        "STORAGE_NODE_ATTESTED",
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomHex = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");

      setStreamFeed((prev) => [
        { id: Date.now(), text: randomAction, hash: `0x${randomHex}... PASS` },
        ...prev.slice(0, 4),
      ]);
    }, 2400);

    return () => {
      clearInterval(clockInterval);
      clearInterval(streamInterval);
    };
  }, []);

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
      navigate(from, { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail || "Invalid username or password";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  }

  const handleQuickFill = () => {
    setUsername("admin");
    setPassword("admin123");
    toast.info("Demo Root Operator credentials populated!");
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Shield size={14} color="var(--primary)" />
          <strong style={{ color: "var(--primary)" }}>SECURESENTINEL GATEWAY</strong>
          <span>• PROTOCOL V4.2</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--secondary)" }}>[■] DEFENSE GRID ONLINE</span>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Main HUD Layout Grid */}
      <div className="login-hud-container">
        {/* Left Flanking HUD Panel */}
        <div className="hud-side-panel corner-box">
          <div className="hud-panel-title">
            <Radio size={13} className="animate-pulse" /> Live Telemetry
          </div>

          <div className="hud-stat-box">
            <label>Cryptographic Defense</label>
            <div className="value" style={{ color: "var(--secondary)" }}>
              [■] ZERO-TRUST (ACTIVE)
            </div>
          </div>

          <div className="hud-stat-box">
            <label>NIST SP 800-88</label>
            <div className="value">ATTESTATION NOMINAL</div>
          </div>

          <div className="hud-stat-box">
            <label>Response Latency</label>
            <div className="value" style={{ color: "var(--primary)" }}>
              sub-8ms (AIR-GAPPED)
            </div>
          </div>

          <div className="hud-stat-box">
            <label>Storage Vectors</label>
            <div className="value" style={{ fontSize: "11px" }}>
              AWS S3 • GCS • AZURE • LOCAL
            </div>
          </div>

          <div style={{ fontSize: "10px", color: "var(--on-surface-variant)", borderTop: "1px solid var(--outline-variant)", paddingTop: "8px" }}>
            NODE_08 STATUS: OPERATIONAL
          </div>
        </div>

        {/* Central Tactical Login Form */}
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-badge">
            <Shield size={12} /> ZERO-TRUST PORTAL
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
                Sign In to Console <ArrowRight size={15} />
              </>
            )}
          </button>

          <div className="auth-footer-links">
            <span>Need operator access? </span>
            <Link to="/register" className="auth-link">Register Account</Link>
          </div>

          <div className="default-creds-hint">
            <small>Default Access: <code>admin</code> / <code>admin123</code></small>
            <button
              type="button"
              onClick={handleQuickFill}
              className="quick-fill-btn"
            >
              [Quick Fill Demo Root Credentials]
            </button>
          </div>
        </form>

        {/* Right Flanking HUD Panel (Live Cypher Stream) */}
        <div className="hud-side-panel corner-box">
          <div className="hud-panel-title">
            <Terminal size={13} /> Live Cypher Stream
          </div>

          <div className="hud-stream-feed">
            {streamFeed.map((item) => (
              <div className="stream-row" key={item.id}>
                <span style={{ color: "var(--on-surface)", fontWeight: "600" }}>{item.text}</span>
                <span className="stream-hash">{item.hash}</span>
              </div>
            ))}
          </div>

          <div className="hud-stat-box" style={{ marginTop: "auto" }}>
            <label>Entropy Divergence Ratio</label>
            <div className="value" style={{ color: "var(--primary)" }}>50.00% AVALANCHE</div>
          </div>

          <div style={{ fontSize: "10px", color: "var(--secondary)", borderTop: "1px solid var(--outline-variant)", paddingTop: "8px" }}>
            [■] HASH VERIFICATION OK
          </div>
        </div>
      </div>

      {/* Bottom HUD Status Strip */}
      <div className="login-bottom-strip">
        <div>SECURESENTINEL SOC ARCHITECTURE • ZERO RAW PAYLOAD EXPOSURE</div>
        <div style={{ color: "var(--primary)" }}>CLASSIFICATION: UNCLASSIFIED / OPERATIONAL</div>
      </div>
    </div>
  );
}

export default Login;

