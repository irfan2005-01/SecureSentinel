function Features() {
  const features = [
    "Real-time Verification",
    "Tamper Detection",
    "Audit Logs",
    "Risk Monitoring",
  ];

  return (
    <section className="features">
      {features.map((feature) => (
        <div key={feature} className="feature-card">
          <h3>{feature}</h3>
        </div>
      ))}
    </section>
  );
}

export default Features;