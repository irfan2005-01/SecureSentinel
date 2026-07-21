import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar />

        <h2>Overview</h2>
      </main>
    </div>
  );
}

export default Dashboard;