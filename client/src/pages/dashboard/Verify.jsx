import "../../styles/Dashboard.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import VerifyCard from "../../components/VerifyCard";

function Verify() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar />

        <h2 style={{ marginBottom: "24px" }}>
          Verify File Integrity
        </h2>

        <VerifyCard />
      </main>
    </div>
  );
}

export default Verify;