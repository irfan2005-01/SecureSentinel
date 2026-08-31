import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Download,
  FileText,
  Award,
  X,
  CheckCircle,
  AlertTriangle,
  Lock,
  Calendar,
  Layers,
} from "lucide-react";
import api, { getAuthUser } from "../services/api";
import StatusCard from "./StatusCard";
import { toast } from "react-toastify";

function VerifyCard() {
  const inputRef = useRef();
  const location = useLocation();
  const user = getAuthUser() || {};

  const [result, setResult] = useState(location.state?.simulatedResult || null);
  const [selectedFile, setSelectedFile] = useState(location.state?.simulatedResult?.filename || "");
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    if (location.state?.simulatedResult) {
      setResult(location.state.simulatedResult);
      setSelectedFile(location.state.simulatedResult.filename);
    }
  }, [location.state]);

  const verifyFile = async (file) => {
    if (!file) return;

    setSelectedFile(file.name);
    setVerifying(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file, file.name || "candidate_asset.bin");

    try {
      const res = await api.post("/api/verify/verify", formData, {
        timeout: 120000,
      });
      setResult({
        ...res.data,
        filename: file.name,
      });

      if (res.data.status === "Verified") {
        toast.success("Cryptographic integrity confirmed! Byte-level match.");
      } else if (res.data.status === "Tampered") {
        toast.error("🚨 SECURITY ALERT! File content has been modified or corrupted.");
      } else if (res.data.status === "Not Found") {
        toast.warning("File signature not found in your vault.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification network request failed");
      setResult({
        filename: file.name,
        status: "Error",
        message: "Failed to connect to verification engine.",
        sha256: "-",
      });
    } finally {
      setVerifying(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const downloadReport = async () => {
    if (!result || !result.filename) return;

    setDownloading(true);
    try {
      const res = await api.get(
        `/api/verify/report/${encodeURIComponent(result.filename)}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${result.filename}_Verification_Report.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Cryptographic PDF report downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF report (ensure file exists in vault)");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="card">
        <p className="section-label">Deterministic Challenge</p>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
          Cryptographic Integrity Audit (PDP Engine)
        </h2>

        <div
          className="upload-box"
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              verifyFile(e.dataTransfer.files[0]);
            }
          }}
          style={{ cursor: verifying ? "wait" : "pointer" }}
        >
          <ShieldCheck size={40} color="var(--primary)" style={{ marginBottom: "10px" }} />

          <h3>Select a Candidate File to Audit</h3>
          <p>Instant Provable Data Possession challenge against stored vault SHA-256 fingerprint</p>

          <button
            type="button"
            className="browse-btn"
            disabled={verifying}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current.click();
            }}
          >
            {verifying ? "Computing Signatures..." : "Choose File to Audit"}
          </button>

          {selectedFile && (
            <div className="selected-file">
              <FileText size={13} /> {selectedFile}
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="*/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              verifyFile(e.target.files[0]);
            }
          }}
        />
      </div>

      <StatusCard result={result} />

      {/* Action Buttons: Certificate Preview & PDF Download */}
      {result && result.status !== "Not Found" && result.status !== "Error" && (
        <div style={{ display: "grid", gridTemplateColumns: result.status === "Verified" ? "1fr 1fr" : "1fr", gap: "12px", marginTop: "16px" }}>
          {result.status === "Verified" && (
            <button
              className="browse-btn"
              onClick={() => setShowCertModal(true)}
              style={{
                background: "var(--surface-container-high)",
                border: "1px solid var(--primary)",
                color: "var(--primary)",
                padding: "12px",
                fontSize: "12px",
                justifyContent: "center",
              }}
            >
              <Award size={16} /> View Digital Certificate
            </button>
          )}

          <button
            className="browse-btn"
            disabled={downloading}
            style={{
              padding: "12px",
              fontSize: "12px",
              justifyContent: "center",
            }}
            onClick={downloadReport}
          >
            <Download size={16} />
            {downloading ? "Generating Certified PDF..." : "Download Official Audit Report (PDF)"}
          </button>
        </div>
      )}

      {/* Holographic Security Certificate Modal */}
      {showCertModal && result && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(9, 15, 21, 0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
          onClick={() => setShowCertModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "var(--surface-container)",
              border: "2px solid var(--primary)",
              padding: "32px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
            className="corner-box"
          >
            <button
              onClick={() => setShowCertModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                color: "var(--on-surface-variant)",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: "center", borderBottom: "1px solid var(--outline-variant)", paddingBottom: "20px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  background: "var(--primary)",
                  color: "var(--on-primary)",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Award size={32} />
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--on-surface)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Cryptographic Integrity Certificate
              </h2>
              <p style={{ fontSize: "11px", color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace", marginTop: "4px" }}>
                NIST SP 800-88 AUDIT COMPLIANCE ATTESTATION
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)" }}>FILE ASSET:</span>
                <span style={{ color: "var(--on-surface)", fontWeight: "700" }}>{result.filename}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)" }}>VERIFICATION STATUS:</span>
                <span style={{ color: "var(--secondary)", fontWeight: "700" }}>[■] 100% CRYPTOGRAPHIC MATCH</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)" }}>STORAGE ENGINE:</span>
                <span style={{ color: "var(--primary)", fontWeight: "700" }}>{(result.storage_provider || "LOCAL").toUpperCase()}</span>
              </div>

              <div style={{ padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)", display: "block", marginBottom: "4px" }}>SHA-256 CHECKSUM:</span>
                <code style={{ color: "var(--primary)", fontSize: "11px", wordBreak: "break-all" }}>{result.sha256}</code>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)" }}>AUDIT TIMESTAMP:</span>
                <span style={{ color: "var(--on-surface)" }}>{new Date().toUTCString()}</span>
              </div>
            </div>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "10px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace" }}>
                ISSUER: SECURESENTINEL ZERO-TRUST PDP ENGINE
              </div>
              <button
                onClick={downloadReport}
                className="browse-btn"
                style={{ padding: "8px 16px", fontSize: "11px" }}
              >
                <Download size={13} /> Save PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VerifyCard;

