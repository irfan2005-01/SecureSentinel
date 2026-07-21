import { FiDatabase, FiServer, FiShield, FiClock } from "react-icons/fi";

function SecurityStatus() {
  const items = [
    {
      icon: <FiServer />,
      title: "API",
      value: "Online",
    },
    {
      icon: <FiDatabase />,
      title: "Database",
      value: "Connected",
    },
    {
      icon: <FiShield />,
      title: "Risk",
      value: "Low",
    },
    {
      icon: <FiClock />,
      title: "Monitoring",
      value: "Active",
    },
  ];

  return (
    <div className="card security-card">
      <p className="section-label">
        System
      </p>

      <h2>Security Status</h2>

      {items.map((item) => (
        <div
          key={item.title}
          className="security-item"
        >
          <div className="security-left">
            <div className="security-icon">
              {item.icon}
            </div>

            <span>{item.title}</span>
          </div>

          <span className="security-online">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SecurityStatus;