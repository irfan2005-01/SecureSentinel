function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#121212",
        border: "1px solid #242424",
        borderRadius: "18px",
        padding: "28px",
      }}
    >
      <p
        style={{
          color: "#8b8b8b",
          marginBottom: "12px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: "34px",
          fontWeight: "700",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default StatCard;