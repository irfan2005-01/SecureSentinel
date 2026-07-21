import "../../styles/Dashboard.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import UploadCard from "../../components/UploadCard";

function Upload() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar />

        <h2 style={{ marginBottom: "24px" }}>
          Upload Files
        </h2>

        <UploadCard />
      </main>
    </div>
  );
}

export default Upload;