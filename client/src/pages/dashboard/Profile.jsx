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
} from "lucide-react";
import api, { getAuthUser, setAuthSession } from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import "../../styles/Dashboard.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'security' | 'storage' | 'stats'
  const [profile, setProfile] = useState(null);
  // loading
  const [savingDetails, setSavingDetails] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
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
      setOrganization(data.organization || "");
      setPhoneNumber(data.phone_number || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
      setPreferredCloud(data.preferred_cloud_provider || "local");

      // Update local storage user
      const existingUser = getAuthUser() || {};
      setAuthSession(localStorage.getItem("token"), {
        ...existingUser,
        full_name: data.full_name,
        email: data.email,
        organization: data.organization,
        preferred_cloud_provider: data.preferred_cloud_provider,
        avatar_url: data.avatar_url,
      });
    } catch (err) {
      console.error("Failed to load operator profile", err);
      toast.error("Could not fetch operator profile");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingDetails(true);

    try {
      const res = await api.put("/api/auth/profile", {
        full_name: fullName,
        email: email,
        organization: organization,
        phone_number: phoneNumber,
        bio: bio,
        avatar_url: avatarUrl,
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
        <Topbar title="Operator Profile & Security" description="Manage cryptographic keys, identity metadata, and vault preferences" />

        {/* Profile Header Card */}
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            marginBottom: "28px",
            background: "linear-gradient(135deg, rgba(13, 21, 39, 0.8) 0%, rgba(10, 15, 29, 0.9) 100%)",
            border: "1px solid rgba(0, 240, 255, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: avatarUrl
                  ? `url(${avatarUrl}) center/cover`
                  : "linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "28px",
                fontWeight: "800",
                color: "#fff",
                border: "2px solid #00f0ff",
                boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)",
              }}
            >
              {!avatarUrl && initials}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", margin: 0 }}>
                  {fullName || profile?.username || "Operator"}
                </h2>
                <span
                  className="status verified"
                  style={{ fontSize: "11px", textTransform: "uppercase" }}
                >
                  <CheckCircle2 size={12} /> Root Operator
                </span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0 0" }}>
                @{profile?.username} • {organization || "SecureSentinel Security Operations"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ textAlign: "right", borderRight: "1px solid rgba(255, 255, 255, 0.08)", paddingRight: "16px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>PROTECTED FILES</span>
              <p style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: "800", color: "#00f0ff" }}>
                {profile?.stats?.total_files || 0}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>INTEGRITY RATE</span>
              <p style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: "800", color: "#00e699" }}>
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
            marginBottom: "24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "8px",
          }}
        >
          {[
            { id: "details", label: "Personal Details", icon: <UserIcon size={16} /> },
            { id: "security", label: "Security & Credentials", icon: <Lock size={16} /> },
            { id: "storage", label: "Cloud Preferences", icon: <Cloud size={16} /> },
            { id: "stats", label: "Vault Usage Metrics", icon: <Database size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "rgba(0, 240, 255, 0.12)" : "transparent",
                color: activeTab === tab.id ? "#00f0ff" : "#94a3b8",
                border: activeTab === tab.id ? "1px solid rgba(0, 240, 255, 0.3)" : "1px solid transparent",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Personal Details */}
        {activeTab === "details" && (
          <form onSubmit={handleUpdateProfile} className="card" style={{ maxWidth: "760px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>
              Operator Profile Information
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "24px" }}>
              Update your personnel metadata and audit contact details.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <div className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Irfan Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Email Address</label>
                <input
                  type="email"
                  placeholder="operator@securesentinel.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Organization / Unit</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Defense Command"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Bio / Mission Scope</label>
                <textarea
                  rows={3}
                  placeholder="Senior Cyber Integrity Engineer managing multi-cloud cryptographic evidence vaults..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={savingDetails}
                style={{
                  background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
                  color: "#050811",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 0 20px rgba(0, 240, 255, 0.3)",
                }}
              >
                <Save size={16} />
                {savingDetails ? "Saving Details..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === "security" && (
          <form onSubmit={handleChangePassword} className="card" style={{ maxWidth: "600px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>
              Update Security Credentials
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "24px" }}>
              Passwords are salted with 12-round bcrypt and stored using zero-knowledge one-way hashing.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    background: "#080c18",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <button
                  type="submit"
                  disabled={changingPassword}
                  style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #00f0ff 100%)",
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Key size={16} />
                  {changingPassword ? "Updating Credentials..." : "Commit Password Change"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: Cloud Storage Preferences */}
        {activeTab === "storage" && (
          <div className="card" style={{ maxWidth: "700px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>
              Cloud Provider Routing
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
              Select which cloud driver new file ingestions default to.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              {[
                { id: "local", name: "Local Disk Vault", desc: "Air-gapped on-premise storage", icon: <HardDrive /> },
                { id: "s3", name: "Amazon AWS S3", desc: "Global S3 bucket object storage", icon: <Cloud /> },
                { id: "gcs", name: "Google Cloud Storage", desc: "Multi-regional Google Cloud bucket", icon: <Database /> },
                { id: "azure", name: "Microsoft Azure Blob", desc: "Enterprise Azure container storage", icon: <Cloud /> },
              ].map((prov) => {
                const isSelected = preferredCloud === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => setPreferredCloud(prov.id)}
                    style={{
                      padding: "18px",
                      borderRadius: "14px",
                      border: isSelected ? "2px solid #00f0ff" : "1px solid rgba(255, 255, 255, 0.08)",
                      background: isSelected ? "rgba(0, 240, 255, 0.08)" : "#080c18",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", color: "#fff", fontSize: "14px" }}>{prov.name}</span>
                      {isSelected && <Check size={16} color="#00f0ff" />}
                    </div>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0 0" }}>{prov.desc}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleUpdateProfile}
              style={{
                background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
                color: "#050811",
                padding: "11px 24px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Save Preferred Provider
            </button>
          </div>
        )}

        {/* TAB 4: Vault Usage Metrics */}
        {activeTab === "stats" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", maxWidth: "900px" }}>
            <div className="card metric-card">
              <span className="metric-title">Protected Files</span>
              <h2 className="metric-value" style={{ color: "#00f0ff" }}>{profile?.stats?.total_files || 0}</h2>
              <p className="metric-subtitle">Active cryptographic baselines</p>
            </div>

            <div className="card metric-card">
              <span className="metric-title">Storage Encrypted</span>
              <h2 className="metric-value" style={{ color: "#00e699" }}>{profile?.stats?.total_megabytes || 0} MB</h2>
              <p className="metric-subtitle">{profile?.stats?.total_bytes || 0} bytes in vault</p>
            </div>

            <div className="card metric-card">
              <span className="metric-title">Audit Log Entries</span>
              <h2 className="metric-value" style={{ color: "#a855f7" }}>{profile?.stats?.total_logs || 0}</h2>
              <p className="metric-subtitle">Immutable forensic events</p>
            </div>

            <div className="card metric-card">
              <span className="metric-title">Integrity Pass Rate</span>
              <h2 className="metric-value" style={{ color: "#38bdf8" }}>{profile?.stats?.success_rate || 100}%</h2>
              <p className="metric-subtitle">Verified authentic files</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
