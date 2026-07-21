import { useRef, useState } from "react";
import {
  FiUploadCloud,
  FiFile,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../services/api";

function UploadCard() {
  const inputRef = useRef();

  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;

    setUploaded(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload", formData);

      setFileName(file.name);
      setUploaded(true);

      toast.success("File uploaded successfully");
    } catch (err) {
      console.error(err);

      toast.error("Upload failed");
    }
  };

  return (
    <div className="card upload-card">
      <p className="section-label">
        Upload
      </p>

      <h2>Upload Files</h2>

      <div
        className="upload-box"
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFile(e.dataTransfer.files[0]);
        }}
      >
        <FiUploadCloud className="upload-icon" />

        <h3>Drag & Drop Files</h3>

        <p>or click to browse your computer</p>

        <button
          type="button"
          className="browse-btn"
        >
          Choose File
        </button>

        <small>
          PDF • DOCX • PNG • JPG
        </small>

        {uploaded && (
          <>
            <div className="selected-file">
              <FiFile />
              <span>{fileName}</span>
            </div>

            <div className="upload-success">
              <FiCheckCircle />
              <span>File uploaded successfully</span>
            </div>
          </>
        )}
      </div>

      <input
        hidden
        ref={inputRef}
        type="file"
        onChange={(e) => uploadFile(e.target.files[0])}
      />
    </div>
  );
}

export default UploadCard;