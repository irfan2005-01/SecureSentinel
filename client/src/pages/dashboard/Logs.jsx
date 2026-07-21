import "../../styles/Dashboard.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import LogsTable from "../../components/LogsTable";

function Logs() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar />

        <LogsTable />
      </main>
    </div>
  );
}

export default Logs;