function Sidebar() {
  const links = [
    "Dashboard",
    "Upload",
    "Files",
    "Verify",
    "Logs",
    "Alerts",
    "Profile",
  ];

  return (
    <aside
      style={{
        borderRight: "1px solid #1d1d1d",
        padding: "80px 40px",
      }}
    >
      {links.map((item) => (
        <p
          key={item}
          style={{
            color: "#6f6f6f",
            marginBottom: "34px",
            cursor: "pointer",
            fontSize: "17px",
            transition: ".3s",
          }}
        >
          {item}
        </p>
      ))}
    </aside>
  );
}

export default Sidebar;