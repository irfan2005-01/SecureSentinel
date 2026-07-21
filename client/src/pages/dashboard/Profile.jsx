import "../../styles/Dashboard.css";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { FiUser, FiShield, FiMail, FiLogIn } from "react-icons/fi";

function Profile() {
  const username = localStorage.getItem("username") || "Administrator";

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <Topbar />

        <div className="card profile-card">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <h2>{username}</h2>

          <p className="section-label">
            SecureSentinel Administrator
          </p>

          <div className="profile-info">

            <div className="profile-item">
              <FiUser />
              <span>Username</span>
              <strong>{username}</strong>
            </div>

            <div className="profile-item">
              <FiShield />
              <span>Role</span>
              <strong>Administrator</strong>
            </div>

            <div className="profile-item">
              <FiMail />
              <span>Email</span>
              <strong>admin@securesentinel.local</strong>
            </div>

            <div className="profile-item">
              <FiLogIn />
              <span>Status</span>
              <strong style={{ color: "#22c55e" }}>
                Logged In
              </strong>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;