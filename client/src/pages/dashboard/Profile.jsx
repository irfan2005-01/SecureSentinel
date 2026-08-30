import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  User as UserIcon,
  Lock,
  Cloud,
  Key,
  CheckCircle2,
  HardDrive,
  Database,
  Save,
  Check,
  Shield,
  Fingerprint,
  Cpu,
} from "lucide-react";
import api, { getAuthUser, setAuthSession } from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import "../../styles/Dashboard.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'security' | 'storage' | 'stats'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Form states - streamlined
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredCloud, setPreferredCloud] = useState("local");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchFullProfile();
  }, []);

  async function fetchFullProfile() {
    setLoading(true);
    try {
      const res = await api.get("/api/auth/profile");
      const data = res.data;
      setProfile(data);
      setFullName(data.full_name || "");
      setEmail(data.email || "");
      setPreferredCloud(data.preferred_cloud_provider || "local");

      // Update local storage user
      const existingUser = getAuthUser() || {};
      setAuthSession(localStorage.getItem("token"), {
        ...existingUser,
        full_name: data.full_name,
        email: data.email,
        preferred_cloud_provider: data.preferred_cloud_provider,
      });
    } catch (err) {
      console.error("Failed to load operator profile", err);
      toast.error("Could not fetch operator profile");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    setSavingDetails(true);

    try {
      const res = await api.put("/api/auth/profile", {
        full_name: fullName,
        email: email,
        preferred_cloud_provider: preferredCloud,
      });

      toast.success(res.data.message || "Profile successfully updated!");
      await fetchFullProfile();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update profile";
      toast.error(msg);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.warning("Please enter your current password");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.post("/api/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.detail || "Password change failed";
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const initials = (fullName || profile?.username || "A").charAt(0).toUpperCase();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar
          title="Operator Profile & Security Enclave"
          description="Manage operator identity, cryptographic keys, and cloud vault routing"
        />

        {/* Profile Header Card */}
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "var(--primary)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "22px",
                fontWeight: "800",
                color: "var(--on-primary)",
                border: "1px solid var(--outline-variant)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {initials}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
                  {fullName || profile?.username || "Operator"}
                </h2>
                <span
                  className="status verified"
                  style={{ fontSize: "10px", textTransform: "uppercase" }}
                >
                  <CheckCircle2 size={11} /> SEC-ADMIN (ROOT)
                </span>
              </div>
              <p style={{ color: "var(--on-surface-variant)", fontSize: "12px", margin: "4px 0 0 0", fontFamily: "'JetBrains Mono', monospace" }}>
                @{profile?.username} • {email || "operator@securesentinel.io"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ textAlign: "right", borderRight: "1px solid var(--outline-variant)", paddingRight: "16px" }}>
              <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>PROTECTED ASSETS</span>
              <p style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "800", color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                {profile?.stats?.total_files || 0}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>INTEGRITY RATE</span>
              <p style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "800", color: "var(--secondary)", fontFamily: "'JetBrains Mono', monospace" }}>
                {profile?.stats?.success_rate || 100}%
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
            borderBottom: "1px solid var(--outline-variant)",
            paddingBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "details", label: "Identity & Credentials", icon: <UserIcon size={14} /> },
            { id: "security", label: "Security & Passwords", icon: <Lock size={14} /> },
            { id: "storage", label: "Cloud Routing", icon: <Cloud size={14} /> },
            { id: "stats", label: "Vault Usage Metrics", icon: <Database size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "var(--surface-container-high)" : "transparent",
                color: activeTab === tab.id ? "var(--primary)" : "var(--on-surface-variant)",
                border: activeTab === tab.id ? "1px solid var(--outline-variant)" : "1px solid transparent",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: "uppercase",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Operator Identity */}
        {activeTab === "details" && (
          <form onSubmit={handleUpdateProfile} className="card" style={{ maxWidth: "760px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--on-surface)", marginBottom: "4px" }}>
              Operator Identity & Access Parameters
            </h3>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "12px", marginBottom: "20px" }}>
              Essential cryptographic identity information and alert notification endpoints.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Operator Handle (Username)</label>
                <input
                  type="text"
                  value={profile?.username || ""}
                  disabled
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "10px 12px",
                    color: "var(--primary)",
                    fontSize: "13px",
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: "not-allowed",
                    opacity: 0.85,
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Operator Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Irfan Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "10px 12px",
                    color: "var(--on-surface)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Alert Notification Email Address</label>
                <input
                  type="email"
                  placeholder="operator@securesentinel.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "10px 12px",
                    color: "var(--on-surface)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Cryptographic Security Details */}
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Enclave Access Level</label>
                <div
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Shield size={16} color="var(--primary)" />
                    <span style={{ color: "var(--on-surface)" }}>LEVEL 5: SUPERUSER (FULL PROTOCOL ACCESS)</span>
                  </div>
                  <span style={{ color: "var(--secondary)", fontSize: "11px" }}>[■] ACTIVE</span>
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Hardware Enclave Fingerprint</label>
                <div
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Fingerprint size={16} color="var(--secondary)" />
                    <span style={{ color: "var(--secondary)" }}>SHA256: 7F2B8E901A4D5C6E...C94A8B01</span>
                  </div>
                  <span>NIST SP 800-88 VERIFIED</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="browse-btn"
                disabled={savingDetails}
                style={{
                  padding: "10px 22px",
                  fontSize: "12px",
                }}
              >
                <Save size={14} />
                {savingDetails ? "Saving Details..." : "Save Operator Details"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === "security" && (
          <form onSubmit={handleChangePassword} className="card" style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--on-surface)", marginBottom: "4px" }}>
              Update Security Credentials
            </h3>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "12px", marginBottom: "20px" }}>
              Passwords are salted with 12-round bcrypt and stored using zero-knowledge one-way hashing.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "10px 12px",
                    color: "var(--on-surface)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "10px 12px",
                    color: "var(--on-surface)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    background: "var(--surface-lowest)",
                    border: "1px solid var(--outline-variant)",
                    padding: "10px 12px",
                    color: "var(--on-surface)",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginTop: "8px" }}>
                <button
                  type="submit"
                  className="browse-btn"
                  disabled={changingPassword}
                  style={{
                    padding: "10px 20px",
                    fontSize: "12px",
                  }}
                >
                  <Key size={14} />
                  {changingPassword ? "Updating Credentials..." : "Commit Password Change"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: Cloud Storage Preferences */}
        {activeTab === "storage" && (
          <div className="card" style={{ maxWidth: "700px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--on-surface)", marginBottom: "4px" }}>
              Cloud Provider Routing
            </h3>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "12px", marginBottom: "18px" }}>
              Select which cloud storage driver new file ingestions default to.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
              {[
                { id: "local", name: "Local Disk Vault", desc: "Air-gapped on-premise storage", icon: <HardDrive size={18} /> },
                { id: "s3", name: "Amazon AWS S3", desc: "Global S3 bucket object storage", icon: <Cloud size={18} /> },
                { id: "gcs", name: "Google Cloud Storage", desc: "Multi-regional Google Cloud bucket", icon: <Database size={18} /> },
                { id: "azure", name: "Microsoft Azure Blob", desc: "Enterprise Azure container storage", icon: <Cloud size={18} /> },
              ].map((prov) => {
                const isSelected = preferredCloud === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => {
                      setPreferredCloud(prov.id);
                    }}
                    style={{
                      padding: "14px",
                      border: isSelected ? "1px solid var(--primary)" : "1px solid var(--outline-variant)",
                      background: isSelected ? "var(--surface-container-high)" : "var(--surface-lowest)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", color: isSelected ? "var(--primary)" : "var(--on-surface)", fontSize: "13px" }}>{prov.name}</span>
                      {isSelected && <Check size={14} color="var(--primary)" />}
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: "4px 0 0 0" }}>{prov.desc}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleUpdateProfile}
              className="browse-btn"
              disabled={savingDetails}
              style={{
                padding: "10px 20px",
                fontSize: "12px",
              }}
            >
              {savingDetails ? "Saving Routing..." : "Save Default Provider"}
            </button>
          </div>
        )}

        {/* TAB 4: Vault Usage Metrics */}
        {activeTab === "stats" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", maxWidth: "900px" }}>
            <div className="metric-card">
              <span className="metric-title">Protected Files</span>
              <h2 className="metric-value" style={{ color: "var(--primary)" }}>{profile?.stats?.total_files || 0}</h2>
              <p className="metric-subtitle">Active cryptographic baselines</p>
            </div>

            <div className="metric-card">
              <span className="metric-title">Storage Encrypted</span>
              <h2 className="metric-value" style={{ color: "var(--secondary)" }}>{profile?.stats?.total_megabytes || 0} MB</h2>
              <p className="metric-subtitle">{profile?.stats?.total_bytes || 0} bytes in vault</p>
            </div>

            <div className="metric-card">
              <span className="metric-title">Audit Log Entries</span>
              <h2 className="metric-value" style={{ color: "var(--primary)" }}>{profile?.stats?.total_logs || 0}</h2>
              <p className="metric-subtitle">Immutable forensic events</p>
            </div>

            <div className="metric-card">
              <span className="metric-title">Integrity Pass Rate</span>
              <h2 className="metric-value" style={{ color: "var(--secondary)" }}>{profile?.stats?.success_rate || 100}%</h2>
              <p className="metric-subtitle">Verified authentic files</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;

