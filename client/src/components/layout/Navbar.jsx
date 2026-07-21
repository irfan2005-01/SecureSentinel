function Navbar() {
  return (
    <header
      style={{
        height: "80px",
        borderBottom: "1px solid #242424",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: "#0b0b0b",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          letterSpacing: "-1px",
        }}
      >
        SecureSentinel
      </h2>

      <button
        style={{
          background: "transparent",
          color: "#fff",
          fontSize: "28px",
          cursor: "pointer",
        }}
      >
        ☰
      </button>
    </header>
  );
}

export default Navbar;