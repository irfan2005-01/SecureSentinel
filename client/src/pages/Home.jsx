import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Cloud,

  FileCheck,

  AlertTriangle,
  ArrowRight,

  Layers,
  Terminal,
  Activity,
  Zap,
  Globe,

  ChevronRight,
} from "lucide-react";
import { isAuthenticated } from "../services/api";

const tickers = [
  "Provable Data Possession (PDP) Protocol Active",
  "Multi-Cloud Cryptographic Anchoring (AWS • GCS • Azure • Local)",
  "Zero-Knowledge Tamper Detection Engine",
  "Sub-Second SHA-256 Avalanche Verification",
  "NIST SP 800-88 Cryptographic Shredding & Proofs",
];

function Home() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const isAuth = isAuthenticated();

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: "#050811", color: "#f8fafc", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Dynamic Cyber Grid Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating Cyber Navbar */}
      <header
        style={{
          position: "sticky",
          top: "16px",
          zIndex: 100,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 28px",
            background: "rgba(10, 15, 29, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "999px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#050811",
                boxShadow: "0 0 15px rgba(0, 240, 255, 0.5)",
              }}
            >
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontWeight: "800", fontSize: "17px", letterSpacing: "-0.5px", color: "#fff" }}>
                Secure<span style={{ color: "#00f0ff" }}>Sentinel</span>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <a href="#features" style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>Features</a>
            <a href="#architecture" style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>Architecture</a>
            <a href="#multicloud" style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>Multi-Cloud</a>
            <a href="#security" style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>Zero-Trust</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isAuth ? (
              <Link
                to="/dashboard"
                style={{
                  background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
                  color: "#050811",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)",
                }}
              >
                Go to Console <ArrowRight size={15} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontWeight: "600",
                    padding: "8px 16px",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={{
                    background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
                    color: "#050811",
                    padding: "8px 20px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 0 20px rgba(0, 240, 255, 0.4)",
                  }}
                >
                  Launch Console <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px 20px 80px",
          textAlign: "center",
        }}
      >
        {/* Live Operational Ticker */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(0, 240, 255, 0.08)",
            border: "1px solid rgba(0, 240, 255, 0.25)",
            padding: "6px 18px",
            borderRadius: "999px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#00e699",
              boxShadow: "0 0 10px #00e699",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#00f0ff",
              letterSpacing: "0.5px",
            }}
          >
            {tickers[tickerIndex]}
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(42px, 6vw, 76px)",
            fontWeight: "900",
            letterSpacing: "-2px",
            lineHeight: "1.05",
            maxWidth: "960px",
            margin: "0 auto 24px",
            color: "#ffffff",
          }}
        >
          Provable Cloud Integrity.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00f0ff 0%, #00e699 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Zero-Drift Security.
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#94a3b8",
            maxWidth: "720px",
            margin: "0 auto 40px",
            lineHeight: "1.6",
          }}
        >
          Continuous cryptographic verification for enterprise files across AWS S3, Google Cloud Storage,
          Azure Blob, and Private Vaults. Instant tamper detection with mathematical proof.
        </p>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link
            to={isAuth ? "/dashboard" : "/register"}
            style={{
              background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
              color: "#050811",
              padding: "16px 36px",
              borderRadius: "14px",
              fontSize: "16px",
              fontWeight: "800",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 30px rgba(0, 240, 255, 0.4)",
              transition: "transform 0.2s ease",
            }}
          >
            Launch Cyber Console <ArrowRight size={18} />
          </Link>

          <Link
            to={isAuth ? "/verify" : "/login"}
            style={{
              background: "rgba(13, 21, 39, 0.8)",
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "16px 32px",
              borderRadius: "14px",
              fontSize: "16px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backdropFilter: "blur(12px)",
            }}
          >
            <Shield size={18} color="#00f0ff" />
            Instant File Audit
          </Link>
        </div>

        {/* Live Metrics Counter Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "80px",
            padding: "30px",
            background: "rgba(13, 21, 39, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            backdropFilter: "blur(16px)",
          }}
        >
          <div>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#00f0ff", fontFamily: "'JetBrains Mono', monospace" }}>
              256-BIT
            </div>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>SHA-256 Cryptographic Anchoring</div>
          </div>
          <div>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#00e699", fontFamily: "'JetBrains Mono', monospace" }}>
              &lt; 150ms
            </div>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Integrity Challenge Latency</div>
          </div>
          <div>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#a855f7", fontFamily: "'JetBrains Mono', monospace" }}>
              4 DRIVERS
            </div>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>AWS S3 • GCS • Azure • Local</div>
          </div>
          <div>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", fontFamily: "'JetBrains Mono', monospace" }}>
              100%
            </div>
            <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Deterministic Tamper Detection</div>
          </div>
        </div>
      </section>

      {/* Interactive Pipeline / Architecture Section */}
      <section id="architecture" style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "80px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <p style={{ color: "#00f0ff", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "2px" }}>
            ZERO-TRUST ARCHITECTURE
          </p>
          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#fff", marginTop: "8px" }}>
            Continuous Integrity Verification Pipeline
          </h2>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "10px auto 0" }}>
            How SecureSentinel validates every single byte against remote silent corruption and unauthorized tampering.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {[
            {
              step: "01",
              title: "Chunk-Stream Ingestion",
              desc: "Files are streamed in 1MB memory-safe buffers. Hash computation occurs progressively on-the-fly to protect against DoS attacks.",
              icon: <Layers size={24} color="#00f0ff" />,
            },
            {
              step: "02",
              title: "Multi-Cloud Cryptographic Anchoring",
              desc: "Stored securely into your selected cloud provider (AWS S3, GCS, Azure Blob, or Local) with sanitization and UUID isolation.",
              icon: <Cloud size={24} color="#00e699" />,
            },
            {
              step: "03",
              title: "Deterministic PDP Challenge",
              desc: "Integrity verification audits compare current byte fingerprints against the immutable baseline hash register in constant time.",
              icon: <FileCheck size={24} color="#a855f7" />,
            },
            {
              step: "04",
              title: "Instant Incident & PDF Audit",
              desc: "Tampering immediately trips high-priority SOC alarms and generates downloadable cryptographic verification certificates.",
              icon: <Shield size={24} color="#ff3366" />,
            },
          ].map((card) => (
            <div
              key={card.step}
              style={{
                background: "rgba(13, 21, 39, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "30px",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#64748b",
                  marginBottom: "16px",
                  fontWeight: "700",
                }}
              >
                PHASE // {card.step}
              </div>
              <div style={{ marginBottom: "16px" }}>{card.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "10px" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Matrix Section */}
      <section id="features" style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "100px auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <p style={{ color: "#00e699", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: "2px" }}>
            CYBER PLATFORM CAPABILITIES
          </p>
          <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#fff", marginTop: "8px" }}>
            Engineered for Mission-Critical Data Security
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {[
            {
              icon: <Zap size={24} color="#00f0ff" />,
              title: "Sub-Second Integrity Verification",
              desc: "Compare stored cryptographic hashes with uploaded evidence in milliseconds without exposing raw cloud storage credentials to end users.",
            },
            {
              icon: <Globe size={24} color="#00e699" />,
              title: "Unified Multi-Cloud Engine",
              desc: "Seamlessly switch storage targets across Amazon S3, Google Cloud Storage, Microsoft Azure Blob, or local air-gapped disks with zero code changes.",
            },
            {
              icon: <AlertTriangle size={24} color="#ff3366" />,
              title: "Real-Time Threat Detection",
              desc: "Instant avalanche effect detection: even a single modified bit triggers an immediate security alert and logs an immutable audit trail entry.",
            },
            {
              icon: <Terminal size={24} color="#a855f7" />,
              title: "Automated ReportLab Audit Reports",
              desc: "Generate court-admissible, cryptographically certified PDF verification reports complete with execution timestamps and SHA-256 proofs.",
            },
            {
              icon: <Lock size={24} color="#f59e0b" />,
              title: "Salted Bcrypt & JWT Zero-Trust",
              desc: "Hardware-hardened salted bcrypt password hashing, scoped JWT token sessions, and complete multi-tenant user isolation.",
            },
            {
              icon: <Activity size={24} color="#00f0ff" />,
              title: "Live SOC Metrics & Health Checks",
              desc: "Monitor threat index, storage provider reachability, and historical integrity verification velocity with interactive time-series charts.",
            },
          ].map((feat, i) => (
            <div
              key={i}
              style={{
                background: "rgba(13, 21, 39, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {feat.icon}
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", color: "#fff" }}>{feat.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Compliance Banner */}
      <section
        id="security"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "80px auto",
          padding: "40px",
          background: "linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(0, 230, 153, 0.04) 100%)",
          border: "1px solid rgba(0, 240, 255, 0.2)",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <span style={{ fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", color: "#00f0ff" }}>
            COMPLIANCE & INTEGRITY READY
          </span>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginTop: "6px" }}>
            Enterprise Zero-Knowledge Verification
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", maxWidth: "600px", marginTop: "8px" }}>
            Compliant with NIST SP 800-88 cryptographic sanitization, ISO 27001 auditability, and SOC 2 Type II integrity monitoring requirements.
          </p>
        </div>

        <Link
          to={isAuth ? "/dashboard" : "/register"}
          style={{
            background: "linear-gradient(135deg, #00f0ff 0%, #00e699 100%)",
            color: "#050811",
            padding: "14px 30px",
            borderRadius: "12px",
            fontWeight: "800",
            fontSize: "15px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Get Started Now <ChevronRight size={18} />
        </Link>
      </section>

      {/* Cyber Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "40px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Shield size={18} color="#00f0ff" />
          <span style={{ color: "#fff", fontWeight: "700" }}>SecureSentinel</span>
          <span>© 2026 Enterprise Security Operations. All rights reserved.</span>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#features" style={{ color: "#94a3b8" }}>Capabilities</a>
          <a href="#architecture" style={{ color: "#94a3b8" }}>Architecture</a>
          <Link to="/login" style={{ color: "#94a3b8" }}>Operator Login</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
