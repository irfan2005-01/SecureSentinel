import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Cloud,

  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Database,
  Radio,
  Zap,
} from "lucide-react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import "../../styles/Dashboard.css";

const providerDetails = {
  local: {
    name: "Local File Vault",
    tagline: "Air-gapped on-premise encrypted local storage",
    icon: <HardDrive size={22} color="#00f0ff" />,
    fields: [
      { key: "upload_dir", label: "Upload Directory", placeholder: "uploads", type: "text" },
    ],
  },
  s3: {
    name: "Amazon Web Services (AWS S3)",
    tagline: "Scalable S3 object storage with bucket versioning",
    icon: <Cloud size={22} color="#00e699" />,
    fields: [
      { key: "bucket_name", label: "S3 Bucket Name", placeholder: "my-security-vault", type: "text", required: true },
      { key: "region_name", label: "AWS Region", placeholder: "us-east-1", type: "text", required: true },
      { key: "aws_access_key_id", label: "Access Key ID", placeholder: "AKIA...", type: "text", required: true },
      { key: "aws_secret_access_key", label: "Secret Access Key", placeholder: "••••••••••••••••", type: "password", required: true },
      { key: "endpoint_url", label: "Custom Endpoint URL (Optional for MinIO)", placeholder: "http://localhost:9000", type: "text" },
    ],
  },
  gcs: {
    name: "Google Cloud Storage (GCS)",
    tagline: "Multi-regional Google Cloud bucket storage",
    icon: <Database size={22} color="#a855f7" />,
    fields: [
      { key: "bucket_name", label: "GCS Bucket Name", placeholder: "gcs-security-vault", type: "text", required: true },
      { key: "project_id", label: "GCP Project ID", placeholder: "securesentinel-prod", type: "text" },
      { key: "credentials_json", label: "Service Account Key (JSON or Path)", placeholder: "{\"type\": \"service_account\", ...}", type: "textarea" },
    ],
  },
  azure: {
    name: "Microsoft Azure Blob Storage",
    tagline: "Enterprise container object storage",
    icon: <Cloud size={22} color="#38bdf8" />,
    fields: [
      { key: "container_name", label: "Blob Container Name", placeholder: "vault-container", type: "text", required: true },
      { key: "connection_string", label: "Azure Storage Connection String", placeholder: "DefaultEndpointsProtocol=https;...", type: "password", required: true },
      { key: "account_name", label: "Storage Account Name", placeholder: "securesentinelstore", type: "text" },
      { key: "account_key", label: "Account Key", placeholder: "••••••••••••••••", type: "password" },
    ],
  },
};

function StorageConfig() {
  const [activeProvider, setActiveProvider] = useState("local");
  const [selectedTab, setSelectedTab] = useState("local");
  const [configValues, setConfigValues] = useState({});
  const [healthStatus, setHealthStatus] = useState(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStorageConfig();
  }, []);

  async function loadStorageConfig() {
    try {
      const res = await api.get("/api/storage/config");
      const data = res.data;
      setActiveProvider(data.active_provider || "local");
      setSelectedTab(data.active_provider || "local");
      setConfigValues(data.config || {});
      setHealthStatus(data.health || null);
    } catch (err) {
      console.error("Failed to load storage config", err);
      toast.error("Could not fetch storage configuration");
    }
  }

  const handleFieldChange = (key, value) => {
    setConfigValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const res = await api.post("/api/storage/test", {
        provider: selectedTab,
        config: configValues,
      });

      if (res.data.status) {
        toast.success(`Success: ${res.data.message}`);
        setHealthStatus(res.data);
      } else {
        toast.error(`Validation Failed: ${res.data.message}`);
        setHealthStatus(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Connection test failed";
      toast.error(msg);
    } finally {
      setTesting(false);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      const res = await api.post("/api/storage/config", {
        provider: selectedTab,
        config: configValues,
      });

      toast.success(res.data.message || "Storage provider updated!");
      setActiveProvider(selectedTab);
      await loadStorageConfig();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to update storage provider";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar title="Multi-Cloud Storage Hub" description="Configure cryptographic storage targets across AWS S3, Google Cloud, Azure, and Local Vault" />

        <div className="card" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="section-label">STORAGE INFRASTRUCTURE</p>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>
                Unified Multi-Cloud Storage Hub
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
                Select and configure the cryptographic target for uploaded baseline hashes and proof vaults.
              </p>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                ACTIVE STORAGE DRIVER
              </span>
              <span
                className="status verified"
                style={{ textTransform: "uppercase", fontWeight: "700", padding: "6px 14px", fontSize: "13px" }}
              >
                <CheckCircle2 size={14} /> {activeProvider}
              </span>
            </div>
          </div>

          {healthStatus && (
            <div
              style={{
                marginTop: "18px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: healthStatus.status ? "rgba(0, 230, 153, 0.08)" : "rgba(255, 51, 102, 0.08)",
                border: `1px solid ${healthStatus.status ? "rgba(0, 230, 153, 0.25)" : "rgba(255, 51, 102, 0.25)"}`,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                color: healthStatus.status ? "#00e699" : "#ff3366",
              }}
            >
              {healthStatus.status ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{healthStatus.message}</span>
            </div>
          )}
        </div>

        {/* Provider Cards Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {Object.entries(providerDetails).map(([key, prov]) => {
            const isSelected = selectedTab === key;
            const isActive = activeProvider === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedTab(key)}
                className="card metric-card"
                style={{
                  cursor: "pointer",
                  border: isSelected ? "2px solid #00f0ff" : "1px solid rgba(255, 255, 255, 0.07)",
                  background: isSelected ? "linear-gradient(180deg, #111a30 0%, #0c1222 100%)" : "rgba(13, 21, 39, 0.75)",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "#00e699",
                      color: "#050811",
                      fontSize: "10px",
                      fontWeight: "800",
                      padding: "2px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    ACTIVE
                  </span>
                )}

                <div className="metric-top">
                  <span style={{ fontSize: "14px", fontWeight: "700", color: isSelected ? "#fff" : "#94a3b8" }}>
                    {prov.name.split(" ")[0]}
                  </span>
                  <div className="metric-icon">
                    {prov.icon}
                  </div>
                </div>

                <p style={{ fontSize: "12px", color: "#64748b", margin: "10px 0 0 0" }}>
                  {prov.tagline}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Config Form */}
        <div className="card" style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ fontSize: "24px" }}>
              {providerDetails[selectedTab]?.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#fff" }}>
                {providerDetails[selectedTab]?.name} Credentials
              </h3>
              <small style={{ color: "#64748b" }}>
                {selectedTab === "local" ? "No external cloud API keys required" : "Zero-knowledge encryption at rest"}
              </small>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {providerDetails[selectedTab]?.fields.map((field) => (
              <div key={field.key} className="form-group">
                <label style={{ color: "#cbd5e1", fontSize: "13px", fontWeight: "600" }}>
                  {field.label} {field.required && <span style={{ color: "#ff3366" }}>*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={field.placeholder}
                    value={configValues[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    style={{
                      background: "#080c18",
                      border: "1px solid #1e293b",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "#fff",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                    }}
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={configValues[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    style={{
                      background: "#080c18",
                      border: "1px solid #1e293b",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      color: "#fff",
                      fontSize: "14px",
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: "14px", marginTop: "12px" }}>
              <button
                type="button"
                className="browse-btn"
                onClick={testConnection}
                disabled={testing}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#00f0ff",
                  border: "1px solid rgba(0, 240, 255, 0.3)",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Radio size={16} />
                {testing ? "Testing Reachability..." : "Test Connection / Ping"}
              </button>

              <button
                type="button"
                className="browse-btn"
                onClick={saveConfiguration}
                disabled={saving}
                style={{
                  background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
                  color: "#050811",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                <Zap size={16} />
                {saving ? "Activating Driver..." : `Save & Activate ${providerDetails[selectedTab]?.name.split(" ")[0]}`}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StorageConfig;
