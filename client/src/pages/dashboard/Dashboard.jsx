import "../../styles/Dashboard.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Stats from "../../components/Stats";
import RecentActivity from "../../components/RecentActivity";
import VerificationChart from "../../components/VerificationChart";
import SecurityStatus from "../../components/SecurityStatus";

function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">

        <Topbar />

        <Stats />

        <VerificationChart />

        <div className="dashboard-bottom">
          <RecentActivity />
          <SecurityStatus />
        </div>

      </main>
    </div>
  );
}

export default Dashboard;