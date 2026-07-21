import { useRef, useState } from "react";
import { FiShield, FiDownload } from "react-icons/fi";
import api from "../services/api";
import StatusCard from "./StatusCard";
import { toast } from "react-toastify";

function VerifyCard() {
  const inputRef = useRef();

  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");

  const verifyFile = async (file) => {
    if (!file) return;

    setSelectedFile(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/verify", formData);

      setResult({
        ...res.data,
        filename: file.name,
      });
      if (res.data.status === "Verified") {
  toast.success("File verified successfully");
} else if (res.data.status === "Tampered") {
  toast.error("File has been tampered");
} else if (res.data.status === "Not Found") {
  toast.warning("File not found in the database");
}
    } catch (err) {
      console.error(err);

      toast.error("Verification failed");

      setResult({
        filename: file.name,
        status: "Error",
        message: "Verification failed.",
        sha256: "-",
      });
    }
  };

 const downloadReport = async () => {
  if (!result) return;

  try {
    const res = await api.get(
      `/report/${encodeURIComponent(result.filename)}`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = `${result.filename}_Verification_Report.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    toast.success("Report downloaded");
  } catch (err) {
    console.error(err);
    toast.error("Failed to download report");
  }
};

  return (
    <>
      <div className="card upload-card">

        <p className="section-label">
          Verification
        </p>

        <h2>Verify File Integrity</h2>

        <div
          className="upload-box"
          onClick={() => inputRef.current.click()}
        >
          <FiShield className="upload-icon" />

          <h3>Select a File</h3>

          <p>
            Compare its SHA-256 hash with the stored record.
          </p>

          <button
            type="button"
            className="browse-btn"
          >
            Choose File
          </button>

          {selectedFile && (
            <div className="selected-file">
              {selectedFile}
            </div>
          )}
        </div>

        <input
          hidden
          type="file"
          ref={inputRef}
          onChange={(e) => verifyFile(e.target.files[0])}
        />

      </div>

      <StatusCard result={result} />

      {result &&
        result.status !== "Not Found" &&
        result.status !== "Error" && (
          <button
            className="browse-btn"
            style={{
              marginTop: 24,
              width: "100%",
            }}
            onClick={downloadReport}
          >
            <FiDownload
              style={{ marginRight: 8 }}
            />
            Download Verification Report
          </button>
        )}
    </>
  );
}

export default VerifyCard;