function Topbar() {
  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-tag">
          SECURITY OPERATIONS CENTER
        </p>

        <h1 className="dashboard-title">
          Dashboard
        </h1>

        <p className="dashboard-description">
          Monitor file integrity, verification history,
          security alerts and system activity in real time.
        </p>
      </div>

      <div className="dashboard-user">
        <div className="user-avatar">
          A
        </div>

        <div>
          <h4>Administrator</h4>
          <span>SecureSentinel</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;