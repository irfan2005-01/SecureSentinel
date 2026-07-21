import "../../styles/Dashboard.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import AlertsTable from "../../components/AlertsTable";

function Alerts() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar />

        <AlertsTable />
      </main>
    </div>
  );
}

export default Alerts;