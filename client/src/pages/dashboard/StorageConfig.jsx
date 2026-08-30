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

        <div className="card" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="section-label">STORAGE INFRASTRUCTURE</p>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
                Unified Multi-Cloud Storage Hub
              </h2>
              <p style={{ color: "var(--on-surface-variant)", fontSize: "13px", marginTop: "4px" }}>
                Select and configure the cryptographic target for uploaded baseline hashes and proof vaults.
              </p>
            </div>

            <div>
              <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", display: "block", marginBottom: "4px", fontFamily: "'JetBrains Mono', monospace" }}>
                ACTIVE STORAGE DRIVER
              </span>
              <span
                className="status verified"
                style={{ textTransform: "uppercase", fontWeight: "700", padding: "4px 10px", fontSize: "11px" }}
              >
                <CheckCircle2 size={13} /> {activeProvider}
              </span>
            </div>
          </div>

          {healthStatus && (
            <div
              style={{
                marginTop: "16px",
                padding: "10px 14px",
                background: healthStatus.status ? "rgba(140, 215, 165, 0.08)" : "rgba(255, 180, 171, 0.08)",
                border: `1px solid ${healthStatus.status ? "var(--secondary)" : "var(--error)"}`,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                color: healthStatus.status ? "var(--secondary)" : "var(--error)",
              }}
            >
              {healthStatus.status ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
              <span>{healthStatus.message}</span>
            </div>
          )}
        </div>

        {/* Provider Cards Selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "20px" }}>
          {Object.entries(providerDetails).map(([key, prov]) => {
            const isSelected = selectedTab === key;
            const isActive = activeProvider === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedTab(key)}
                className="metric-card"
                style={{
                  cursor: "pointer",
                  border: isSelected ? "1px solid var(--primary)" : "1px solid var(--outline-variant)",
                  background: isSelected ? "var(--surface-container-high)" : "var(--surface-container)",
                  transition: "all 0.2s ease",
                  position: "relative",
                  padding: "16px",
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "var(--secondary)",
                      color: "var(--surface-lowest)",
                      fontSize: "9px",
                      fontWeight: "800",
                      padding: "2px 6px",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    ACTIVE
                  </span>
                )}

                <div className="metric-top">
                  <span style={{ fontSize: "13px", fontWeight: "700", color: isSelected ? "var(--primary)" : "var(--on-surface)" }}>
                    {prov.name.split(" ")[0]}
                  </span>
                  <div className="metric-icon" style={{ width: "28px", height: "28px" }}>
                    {prov.icon}
                  </div>
                </div>

                <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: "8px 0 0 0" }}>
                  {prov.tagline}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Config Form */}
        <div className="card" style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <div style={{ fontSize: "20px" }}>
              {providerDetails[selectedTab]?.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--on-surface)" }}>
                {providerDetails[selectedTab]?.name} Credentials
              </h3>
              <small style={{ color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px" }}>
                {selectedTab === "local" ? "Air-gapped on-premise vault storage" : "Zero-knowledge cryptographic anchoring"}
              </small>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {providerDetails[selectedTab]?.fields.map((field) => (
              <div key={field.key} className="form-group">
                <label style={{ color: "var(--on-surface-variant)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
                  {field.label} {field.required && <span style={{ color: "var(--error)" }}>*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={field.placeholder}
                    value={configValues[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    style={{
                      background: "var(--surface-lowest)",
                      border: "1px solid var(--outline-variant)",
                      padding: "10px",
                      color: "var(--on-surface)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={configValues[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    style={{
                      background: "var(--surface-lowest)",
                      border: "1px solid var(--outline-variant)",
                      padding: "10px 12px",
                      color: "var(--on-surface)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
                className="browse-btn"
                onClick={testConnection}
                disabled={testing}
                style={{
                  background: "var(--surface-container-high)",
                  color: "var(--on-surface)",
                  border: "1px solid var(--outline-variant)",
                  padding: "10px 18px",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <Radio size={14} />
                {testing ? "Testing Reachability..." : "Test Connection"}
              </button>

              <button
                type="button"
                className="browse-btn"
                onClick={saveConfiguration}
                disabled={saving}
                style={{
                  padding: "10px 22px",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                <Zap size={14} />
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
