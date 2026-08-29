import { useRef, useState } from "react";
import { ShieldCheck, Download, FileText } from "lucide-react";
import api from "../services/api";
import StatusCard from "./StatusCard";
import { toast } from "react-toastify";

function VerifyCard() {
  const inputRef = useRef();

  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const verifyFile = async (file) => {
    if (!file) return;

    setSelectedFile(file.name);
    setVerifying(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/verify/verify", formData);
      setResult({
        ...res.data,
        filename: file.name,
      });

      if (res.data.status === "Verified") {
        toast.success("Cryptographic integrity confirmed! Byte-level match.");
      } else if (res.data.status === "Tampered") {
        toast.error("SECURITY ALERT! File content has been modified or corrupted.");
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
      <div className="card upload-card">
        <p className="section-label">Deterministic Challenge</p>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>
          Cryptographic Integrity Audit
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
          <ShieldCheck size={48} color="#a855f7" style={{ marginBottom: "12px" }} />

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
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #00f0ff 100%)",
              color: "#fff",
            }}
          >
            {verifying ? "Computing Signatures..." : "Choose File to Audit"}
          </button>

          {selectedFile && (
            <div className="selected-file" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "16px" }}>
              <FileText size={14} /> {selectedFile}
            </div>
          )}
        </div>

        <input
          hidden
          type="file"
          ref={inputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              verifyFile(e.target.files[0]);
            }
          }}
        />
      </div>

      <StatusCard result={result} />

      {result && result.status !== "Not Found" && result.status !== "Error" && (
        <button
          className="browse-btn"
          disabled={downloading}
          style={{
            marginTop: 20,
            width: "100%",
            background: "rgba(0, 240, 255, 0.08)",
            color: "#00f0ff",
            border: "1px solid rgba(0, 240, 255, 0.3)",
            padding: "14px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={downloadReport}
        >
          <Download size={18} />
          {downloading ? "Generating Certified PDF..." : "Download Official Cryptographic Audit Report (PDF)"}
        </button>
      )}
    </>
  );
}

export default VerifyCard;
