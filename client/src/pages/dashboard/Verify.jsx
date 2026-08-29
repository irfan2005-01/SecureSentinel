import "../../styles/Dashboard.css";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import VerifyCard from "../../components/VerifyCard";

function Verify() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar title="Cryptographic Integrity Audit" description="Deterministic Provable Data Possession challenge against vault baseline signatures" />

        <VerifyCard />
      </main>
    </div>
  );
}

export default Verify;
