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
    } catch {
      console.error("Failed to load files", err);
    } finally {
      setLoadingFiles(false);
    }
  }

  const uploadFile = async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/files/upload", formData, {
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
      toast.success(`"${file.name}" cryptographically anchored to ${activeProvider.toUpperCase()} vault!`);
      await loadFiles();
    } catch {
      console.error(err);
      const msg = err.response?.data?.detail || "File upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Ingestion Dropzone Card */}
      <div className="card upload-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <p className="section-label">Provable Ingestion</p>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>
              Stream & Anchor File Baseline
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>TARGET CLOUD:</span>
            <span
              className="status"
              style={{
                background: "rgba(0, 240, 255, 0.12)",
                color: "#00f0ff",
                border: "1px solid rgba(0, 240, 255, 0.3)",
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: "12px",
              }}
            >
              <Cloud size={13} style={{ marginRight: "4px" }} /> {activeProvider}
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
            borderColor: dragActive ? "#00f0ff" : undefined,
            background: dragActive ? "rgba(0, 240, 255, 0.08)" : undefined,
            cursor: uploading ? "wait" : "pointer",
          }}
        >
          <UploadCloud className="upload-icon" size={48} style={{ color: "#00f0ff" }} />

          <h3>Drag & Drop Binary Assets Here</h3>
          <p>Continuous 1MB memory chunk-streaming with real-time SHA-256 baseline anchoring</p>

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

          <small style={{ display: "block", marginTop: "14px", color: "#64748b", fontSize: "12px" }}>
            Supports all documents, executables, images, and archives (PDF, DOCX, PNG, ZIP, BIN)
          </small>
        </div>

        <input
          hidden
          ref={inputRef}
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              uploadFile(e.target.files[0]);
            }
          }}
        />

        {/* Live Upload Progress */}
        {uploading && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px", color: "#cbd5e1" }}>
              <span>Streaming chunks to {activeProvider.toUpperCase()}...</span>
              <strong style={{ color: "#00f0ff" }}>{progress}%</strong>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#080c18", borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #00f0ff, #00e699)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Post-Upload Hash Badge */}
        {uploadResult && (
          <div className="card" style={{ marginTop: "24px", background: "rgba(0, 230, 153, 0.05)", border: "1px solid rgba(0, 230, 153, 0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#00e699", marginBottom: "12px" }}>
              <CheckCircle2 size={20} />
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Cryptographic Baseline Anchored</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "14px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>FILE</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#f8fafc" }}>{uploadResult.filename}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>SIZE</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#f8fafc" }}>
                  {(uploadResult.file_size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>STORAGE</span>
                <p style={{ margin: "2px 0 0 0", fontWeight: "700", color: "#00f0ff", textTransform: "uppercase" }}>
                  {uploadResult.storage_provider}
                </p>
              </div>
            </div>

            <div className="hash-card" style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>SHA-256 FINGERPRINT</span>
                <button
                  type="button"
                  onClick={() => copyHash(uploadResult.sha256)}
                  style={{
                    background: "transparent",
                    color: "#00f0ff",
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
              <code>{uploadResult.sha256}</code>
            </div>

            <button
              className="browse-btn"
              onClick={() => navigate("/verify")}
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #00f0ff 100%)",
                color: "#fff",
                fontSize: "13px",
                padding: "8px 18px",
              }}
            >
              <ShieldCheck size={16} /> Audit File Now
            </button>
          </div>
        )}
      </div>

      {/* Vault Files Table */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <p className="section-label">Protected Vault</p>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", margin: 0 }}>
              Anchored File Register ({filesList.length})
            </h2>
          </div>

          <button
            onClick={loadFiles}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#94a3b8",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Refresh Vault
          </button>
        </div>

        {loadingFiles ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading vault inventory...</div>
        ) : filesList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No files anchored in vault yet. Upload a file above to create your first baseline.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#64748b" }}>
                  <th style={{ padding: "12px 14px" }}>File Name</th>
                  <th style={{ padding: "12px 14px" }}>Storage Target</th>
                  <th style={{ padding: "12px 14px" }}>Size</th>
                  <th style={{ padding: "12px 14px" }}>SHA-256 Baseline</th>
                  <th style={{ padding: "12px 14px" }}>Status</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filesList.map((file) => (
                  <tr
                    key={file.id}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <td style={{ padding: "14px", fontWeight: "600", color: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <FileText size={16} color="#00f0ff" />
                        {file.filename}
                      </div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          background: "rgba(0, 240, 255, 0.08)",
                          color: "#00f0ff",
                          border: "1px solid rgba(0, 240, 255, 0.2)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {file.storage_provider}
                      </span>
                    </td>
                    <td style={{ padding: "14px", color: "#94a3b8" }}>
                      {(file.file_size / 1024).toFixed(1)} KB
                    </td>
                    <td style={{ padding: "14px" }}>
                      <code
                        onClick={() => copyHash(file.sha256)}
                        title="Click to copy hash"
                        style={{
                          background: "#080c18",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          color: "#38bdf8",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "inline-block",
                          maxWidth: "180px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.sha256}
                      </code>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span className={file.status === "Verified" ? "status verified" : "status tampered"}>
                        {file.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => handleDownload(file.id, file.filename)}
                          title="Download file"
                          style={{
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            color: "#94a3b8",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <Download size={14} />
                        </button>

                        <button
                          onClick={() => navigate("/verify")}
                          title="Challenge PDP Integrity"
                          style={{
                            background: "rgba(0, 240, 255, 0.1)",
                            border: "1px solid rgba(0, 240, 255, 0.3)",
                            color: "#00f0ff",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <ShieldCheck size={14} /> Audit
                        </button>

                        <button
                          onClick={() => handleDeleteFile(file.id, file.filename)}
                          title="Delete from vault"
                          style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#f87171",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={14} />
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
