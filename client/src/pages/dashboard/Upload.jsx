import "../../styles/Dashboard.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import UploadCard from "../../components/UploadCard";

function Upload() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar title="Vault File Ingestion & Records" description="Stream, encrypt, and anchor evidence assets across multi-cloud drivers" />

        <UploadCard />
      </main>
    </div>
  );
}

export default Upload;
