import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  CheckCircle2,
  Cloud,
  Copy,
  ShieldCheck,
  Download,
  Trash2,
  FileText,
  AlertTriangle,
  Flame,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import api, { getAuthUser } from "../services/api";

function UploadCard() {
  const navigate = useNavigate();
  const inputRef = useRef();

  const [activeProvider, setActiveProvider] = useState("local");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  useEffect(() => {
    fetchActiveStorage();
    loadFiles();
  }, []);

  async function fetchActiveStorage() {
    try {
      const res = await api.get("/api/storage/config");
      if (res.data?.active_provider) {
        setActiveProvider(res.data.active_provider);
      }
    } catch {
      const user = getAuthUser();
      if (user?.preferred_cloud_provider) {
        setActiveProvider(user.preferred_cloud_provider);
      }
    }
  }

  async function loadFiles() {
    setLoadingFiles(true);
    try {
      const res = await api.get("/api/files");
      setFilesList(res.data || []);
    } catch (err) {
      console.error("Failed to load files", err);
    } finally {
      setLoadingFiles(false);
    }
  }

  const uploadFile = async (file) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File exceeds 50MB maximum size limit.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file, file.name || "mobile_asset.bin");

    try {
      const res = await api.post("/api/files/upload", formData, {
        timeout: 120000, // 2 minutes for mobile / large camera images
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      setUploadResult(res.data);
      toast.success(`"${res.data.filename || file.name}" anchored to ${activeProvider.toUpperCase()} vault!`);
      await loadFiles();
    } catch (err) {
      console.error("Upload error", err);
      const msg = err.response?.data?.detail || err.message || "File upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    toast.info("SHA-256 fingerprint copied to clipboard");
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete '${fileName}' from vault?`)) return;

    try {
      await api.delete(`/api/files/${fileId}`);
      toast.success(`File '${fileName}' removed from vault`);
      await loadFiles();
    } catch {
      toast.error("Failed to delete file");
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const res = await api.get(`/api/files/${fileId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${fileName}`);
    } catch {
      toast.error("Failed to retrieve file from storage provider");
    }
  };

  // One-Click Hackathon Tamper Simulation
  const handleSimulateTamperDemo = async (file) => {
    try {
      // Ingest a dummy genuine file if none exists, then verify a mutated version
      const tamperedBlob = new Blob(
        [`MUTATED_PAYLOAD_UNAUTHORIZED_TAMPER_INJECTION_${Date.now()}`],
        { type: "text/plain" }
      );
      const tamperedFile = new File([tamperedBlob], file.filename, {
        type: "text/plain",
      });

      toast.warning(`[SIMULATION] Sending modified byte stream for '${file.filename}'...`);
      
      const formData = new FormData();
      formData.append("file", tamperedFile);
      const verifyRes = await api.post("/api/verify/verify", formData);
      
      if (verifyRes.data?.status === "Tampered") {
        toast.error(`🚨 TAMPER ALERT TRIPPED! Cryptographic divergence caught for '${file.filename}'!`);
        navigate("/verify", { state: { simulatedResult: verifyRes.data } });
      } else {
        toast.info("Verification executed.");
        navigate("/verify");
      }
    } catch (err) {
      console.error(err);
      toast.error("Tamper simulation failed to run");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Ingestion Dropzone Card */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <p className="section-label">Provable Ingestion</p>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
              Stream & Anchor File Baseline
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace" }}>
              TARGET:
            </span>
            <span
              style={{
                background: "var(--surface-lowest)",
                color: "var(--primary)",
                border: "1px solid var(--outline-variant)",
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: "11px",
                padding: "3px 8px",
                fontFamily: "'JetBrains Mono', monospace",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Cloud size={12} /> {activeProvider}
            </span>
          </div>
        </div>

        <div
          className={`upload-box ${dragActive ? "drag-active" : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              uploadFile(e.dataTransfer.files[0]);
            }
          }}
          style={{
            borderColor: dragActive ? "var(--primary)" : undefined,
            background: dragActive ? "var(--surface-container-high)" : undefined,
            cursor: uploading ? "wait" : "pointer",
          }}
        >
          <UploadCloud className="upload-icon" size={40} />

          <h3>Drag & Drop Binary Assets Here</h3>
          <p>Continuous 1MB chunk-streaming with real-time SHA-256 baseline anchoring</p>

          <button
            type="button"
            className="browse-btn"
            disabled={uploading}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current.click();
            }}
          >
            {uploading ? "Encrypting & Streaming..." : "Browse Local Files"}
          </button>

          <small style={{ display: "block", marginTop: "12px", color: "var(--on-surface-variant)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
            [SUPPORTS PDF, DOCX, PNG, ZIP, BIN, CSV, JSON]
          </small>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="*/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              uploadFile(e.target.files[0]);
            }
          }}
        />

        {/* Live Upload Progress */}
        {uploading && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px", color: "var(--on-surface)", fontFamily: "'JetBrains Mono', monospace" }}>
              <span>STREAMING TO {activeProvider.toUpperCase()}...</span>
              <strong style={{ color: "var(--primary)" }}>{progress}%</strong>
            </div>
            <div style={{ width: "100%", height: "6px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "var(--primary)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Post-Upload Hash Badge */}
        {uploadResult && (
          <div style={{ marginTop: "20px", background: "var(--surface-container-high)", border: "1px solid var(--secondary)", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--secondary)", marginBottom: "10px" }}>
              <CheckCircle2 size={18} />
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Cryptographic Baseline Anchored
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>FILE</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "var(--on-surface)", fontSize: "13px" }}>{uploadResult.filename}</p>
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>SIZE</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "var(--on-surface)", fontSize: "13px" }}>
                  {(uploadResult.file_size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>STORAGE</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase", fontSize: "13px" }}>
                  {uploadResult.storage_provider}
                </p>
              </div>
            </div>

            <div className="hash-card" style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase" }}>SHA-256 FINGERPRINT</span>
                <button
                  type="button"
                  onClick={() => copyHash(uploadResult.sha256)}
                  style={{
                    background: "transparent",
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <Copy size={12} /> COPY
                </button>
              </div>
              <code>{uploadResult.sha256}</code>
            </div>

            <button
              className="browse-btn"
              onClick={() => navigate("/verify")}
              style={{
                fontSize: "12px",
                padding: "8px 16px",
              }}
            >
              <ShieldCheck size={14} /> Audit Baseline in PDP Engine
            </button>
          </div>
        )}
      </div>

      {/* Vault Files Table */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <p className="section-label">Protected Vault</p>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
              Anchored File Register ({filesList.length})
            </h2>
          </div>

          <button
            onClick={loadFiles}
            style={{
              background: "var(--surface-container-high)",
              color: "var(--on-surface)",
              border: "1px solid var(--outline-variant)",
              padding: "6px 12px",
              fontSize: "11px",
              fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Refresh Vault
          </button>
        </div>

        {loadingFiles ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
            SCANNING VAULT INVENTORY...
          </div>
        ) : filesList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
            NO FILES ANCHORED IN VAULT. UPLOAD A FILE ABOVE TO ESTABLISH CRYPTOGRAPHIC BASELINE.
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: "100%", minWidth: "650px", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace" }}>
                  <th style={{ padding: "10px 12px" }}>FILE NAME</th>
                  <th style={{ padding: "10px 12px" }}>STORAGE</th>
                  <th style={{ padding: "10px 12px" }}>SIZE</th>
                  <th style={{ padding: "10px 12px" }}>SHA-256 BASELINE</th>
                  <th style={{ padding: "10px 12px" }}>STATUS</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>DEMO & ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filesList.map((file) => (
                  <tr
                    key={file.id}
                    style={{
                      borderBottom: "1px solid var(--outline-subtle)",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <td style={{ padding: "12px", fontWeight: "600", color: "var(--on-surface)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={15} color="var(--primary)" />
                        {file.filename}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          background: "var(--surface-lowest)",
                          color: "var(--primary)",
                          border: "1px solid var(--outline-variant)",
                          padding: "2px 6px",
                          fontSize: "10px",
                          fontWeight: "700",
                          fontFamily: "'JetBrains Mono', monospace",
                          textTransform: "uppercase",
                        }}
                      >
                        {file.storage_provider}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {(file.file_size / 1024).toFixed(1)} KB
                    </td>
                    <td style={{ padding: "12px" }}>
                      <code
                        onClick={() => copyHash(file.sha256)}
                        title="Click to copy hash"
                        style={{
                          background: "var(--surface-lowest)",
                          padding: "3px 6px",
                          border: "1px solid var(--outline-variant)",
                          color: "var(--primary)",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "inline-block",
                          maxWidth: "160px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.sha256}
                      </code>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span className={file.status === "Verified" ? "status verified" : "status tampered"}>
                        {file.status === "Verified" ? "[■] VERIFIED" : "[▲] TAMPERED"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        {/* Live Judge Demo Trigger Button */}
                        <button
                          onClick={() => handleSimulateTamperDemo(file)}
                          title="Simulate 1-byte cyber attack for judging demonstration"
                          style={{
                            background: "rgba(255, 136, 124, 0.12)",
                            border: "1px solid var(--error)",
                            color: "var(--error)",
                            padding: "4px 8px",
                            fontSize: "11px",
                            fontWeight: "700",
                            fontFamily: "'JetBrains Mono', monospace",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Flame size={12} /> ATTACK SIM
                        </button>

                        <button
                          onClick={() => handleDownload(file.id, file.filename)}
                          title="Download file"
                          style={{
                            background: "var(--surface-container-high)",
                            border: "1px solid var(--outline-variant)",
                            color: "var(--on-surface-variant)",
                            padding: "4px 8px",
                            cursor: "pointer",
                          }}
                        >
                          <Download size={13} />
                        </button>

                        <button
                          onClick={() => navigate("/verify")}
                          title="Challenge PDP Integrity"
                          style={{
                            background: "var(--primary)",
                            color: "var(--on-primary)",
                            padding: "4px 8px",
                            fontSize: "11px",
                            fontWeight: "700",
                            fontFamily: "'JetBrains Mono', monospace",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <ShieldCheck size={13} /> AUDIT
                        </button>

                        <button
                          onClick={() => handleDeleteFile(file.id, file.filename)}
                          title="Delete from vault"
                          style={{
                            background: "var(--surface-container-high)",
                            border: "1px solid var(--outline-variant)",
                            color: "var(--error)",
                            padding: "4px 8px",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadCard;

