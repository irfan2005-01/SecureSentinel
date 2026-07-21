import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tag">
          ENTERPRISE CLOUD SECURITY
        </p>

        <h1 className="hero-title">
          Protect.
          <br />
          Verify.
          <br />
          Trust.
        </h1>

        <p className="hero-description">
          SecureSentinel continuously verifies file integrity,
          detects tampering and protects enterprise data with
          real-time cryptographic verification.
        </p>
      </div>
    </section>
  );
}

export default Hero;