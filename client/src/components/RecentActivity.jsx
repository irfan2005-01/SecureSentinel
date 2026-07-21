import { FiCheckCircle, FiAlertTriangle, FiFileText } from "react-icons/fi";

const activities = [
  {
    file: "resume.pdf",
    status: "Verified",
    time: "2 mins ago",
  },
  {
    file: "report.docx",
    status: "Verified",
    time: "12 mins ago",
  },
  {
    file: "contract.pdf",
    status: "Tampered",
    time: "1 hour ago",
  },
];

function RecentActivity() {
  return (
    <div className="card activity-card">
      <div className="section-header">
        <div>
          <p className="section-label">Activity</p>
          <h2>Recent Activity</h2>
        </div>
      </div>

      {activities.map((item, index) => (
        <div className="activity-item" key={index}>
          <div className="activity-left">
            <div className="file-icon">
              <FiFileText />
            </div>

            <div>
              <h4>{item.file}</h4>
              <span>{item.time}</span>
            </div>
          </div>

          <span
            className={
              item.status === "Verified"
                ? "status verified"
                : "status tampered"
            }
          >
            {item.status === "Verified" ? (
              <FiCheckCircle />
            ) : (
              <FiAlertTriangle />
            )}

            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;