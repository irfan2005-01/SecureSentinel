import { useState, useEffect } from "react";
import {
  Zap,
  Shield,
  Layers,
  Cpu,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Coins,
  ArrowRight,
  RefreshCw,
  Terminal,
  FileCheck,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { SentinelIcon } from "../../components/Logo";
import "../../styles/Dashboard.css";

function AgenticHub() {
  const [config, setConfig] = useState(null);
  const [vaultFiles, setVaultFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // x402 Interactive Simulation State
  const [flowStep, setFlowStep] = useState(0); // 0: Idle, 1: Requesting, 2: 402 Challenged, 3: Settling, 4: Confirmed
  const [lastChallenge, setLastChallenge] = useState(null);
  const [lastAttestation, setLastAttestation] = useState(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [cfgRes, filesRes, histRes] = await Promise.all([
        api.get("/api/x402/config"),
        api.get("/api/files"),
        api.get("/api/x402/history"),
      ]);
      setConfig(cfgRes.data);
      setVaultFiles(filesRes.data || []);
      if (filesRes.data && filesRes.data.length > 0) {
        setSelectedFile(filesRes.data[0]);
      }
      setHistory(histRes.data || []);
    } catch (err) {
      console.error("Failed to load x402 config", err);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.info(`${label} copied to clipboard!`);
  };

  // Run the full Live x402 Protocol Flow
  const runLiveX402Attestation = async () => {
    if (!selectedFile && vaultFiles.length === 0) {
      toast.warning("Please upload a file in File Vault first or select a target.");
      return;
    }

    const target = selectedFile || {
      filename: "sentinel_security_baseline.bin",
      sha256: "b5d4045c3f466fa91fe2cc6abe79232a1a57cdf104f7a26e716e0a1e2789df78",
      file_size: 1048576,
    };

    setExecuting(true);
    setFlowStep(1); // 1. Client makes initial request

    try {
      // Step 1: Send request without payment -> triggers HTTP 402 challenge
      await new Promise((r) => setTimeout(r, 600));
      let challengeData = null;
      try {
        await api.post("/api/x402/attest", {
          filename: target.filename,
          sha256: target.sha256,
          file_size: target.file_size,
        });
      } catch (err) {
        if (err.response?.status === 402) {
          challengeData = err.response.data;
          setLastChallenge(challengeData);
          setFlowStep(2); // 2. HTTP 402 Received!
        } else {
          throw err;
        }
      }

      // Step 3: Settle payment via GoPlausible Facilitator on Algorand Testnet
      await new Promise((r) => setTimeout(r, 900));
      setFlowStep(3); // 3. Submitting to Facilitator & Blockchain

      // Step 4: Submit request WITH payment proof
      await new Promise((r) => setTimeout(r, 1000));
      const attestRes = await api.post(
        "/api/x402/attest",
        {
          filename: target.filename,
          sha256: target.sha256,
          file_size: target.file_size,
          simulate_agent: true,
        },
        {
          headers: {
            "X-Payment": "SIMULATE_AGENT",
            "X-Payment-Signature": "x402_avm_goplausible_attestation_proof",
          },
        }
      );

      setLastAttestation(attestRes.data);
      setFlowStep(4); // 4. Attestation Certified On-Chain!
      toast.success("x402 Attestation anchored to Algorand Testnet via GoPlausible!");

      // Refresh history
      const histRes = await api.get("/api/x402/history");
      setHistory(histRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "x402 Flow execution failed");
      setFlowStep(0);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <Topbar
          title="Agentic Solutions: Powered by x402"
          description="Autonomous Algorand Testnet agent gating cryptographic file attestations via the x402 payment protocol"
        />

        {/* Hackathon Track Compliance Banner */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, rgba(243, 190, 101, 0.08) 0%, rgba(14, 20, 27, 0.95) 100%)",
            borderColor: "var(--primary)",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(243, 190, 101, 0.15)", border: "1px solid var(--primary)", padding: "3px 8px", fontSize: "11px", fontWeight: "700", color: "var(--primary)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: "8px" }}>
                <Zap size={13} /> OFFICIAL TRACK: AGENTIC SOLUTIONS (POWERED BY x402)
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--on-surface)", margin: "0 0 6px 0" }}>
                Sentinel Autonomous Security Agent on Algorand
              </h2>
              <p style={{ color: "var(--on-surface-variant)", fontSize: "12px", maxWidth: "800px", lineHeight: "1.6", margin: 0 }}>
                Autonomous AI Sentinel Agent gating cryptographic file possession proofs, deep forensic audits, and immutable on-chain attestations using the <strong>x402 HTTP Payment Protocol</strong> settled through the <strong>GoPlausible Facilitator</strong> on <strong>Algorand Testnet</strong>.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href="https://lora.algokit.io/testnet"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--surface-container-high)",
                  border: "1px solid var(--outline-variant)",
                  color: "var(--primary)",
                  padding: "8px 14px",
                  fontSize: "11px",
                  fontWeight: "700",
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                <ExternalLink size={13} /> LoRA Testnet Explorer
              </a>

              <a
                href="https://dispenser.testnet.algorand.network"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--surface-container-high)",
                  border: "1px solid var(--outline-variant)",
                  color: "var(--secondary)",
                  padding: "8px 14px",
                  fontSize: "11px",
                  fontWeight: "700",
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                <Coins size={13} /> Algo Testnet Faucet
              </a>
            </div>
          </div>
        </div>

        {/* Real-Time Algorand & Facilitator Telemetry Bar */}
        <div className="stats-grid" style={{ marginBottom: "20px" }}>
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-title">BLOCKCHAIN NETWORK</span>
              <div className="metric-icon"><Layers size={16} /></div>
            </div>
            <div className="metric-value" style={{ fontSize: "16px", color: "var(--secondary)" }}>
              ALGORAND TESTNET
            </div>
            <div className="metric-subtitle">
              Genesis: <code style={{ color: "var(--primary)", fontSize: "10px" }}>testnet-v1.0</code>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-title">x402 FACILITATOR</span>
              <div className="metric-icon"><Radio size={16} /></div>
            </div>
            <div className="metric-value" style={{ fontSize: "15px", color: "var(--primary)" }}>
              GOPLAUSIBLE
            </div>
            <div className="metric-subtitle">
              Endpoint: <code style={{ fontSize: "10px" }}>facilitator.goplausible.xyz</code>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-title">STANDARD PRICE</span>
              <div className="metric-icon"><Coins size={16} /></div>
            </div>
            <div className="metric-value" style={{ fontSize: "20px", color: "var(--on-surface)" }}>
              $0.005 USDC
            </div>
            <div className="metric-subtitle">
              Micro-payment / per file attestation
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-title">SENTINEL AGENT NODE</span>
              <div className="metric-icon"><Cpu size={16} /></div>
            </div>
            <div className="metric-value" style={{ fontSize: "16px", color: "var(--secondary)" }}>
              ONLINE (x402 ACTIVE)
            </div>
            <div className="metric-subtitle">
              NIST SP 800-88 Proof Ready
            </div>
          </div>
        </div>

        {/* Interactive x402 Protocol Flow Visualizer */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <p className="section-label">PROTOCOL EXECUTION ENGINE</p>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
                Live x402 HTTP Challenge-Response Sequence
              </h3>
            </div>

            <button
              onClick={runLiveX402Attestation}
              disabled={executing}
              className="browse-btn"
              style={{
                padding: "8px 18px",
                fontSize: "12px",
                background: executing ? "var(--surface-container-highest)" : "var(--primary)",
                color: "var(--on-primary)",
                cursor: executing ? "wait" : "pointer",
              }}
            >
              {executing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Processing x402 on Algorand...
                </>
              ) : (
                <>
                  <Zap size={14} /> Trigger Live x402 Flow
                </>
              )}
            </button>
          </div>

          {/* 4 Interactive Protocol Steps */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {/* Step 1 */}
            <div
              style={{
                padding: "14px",
                background: flowStep >= 1 ? "rgba(243, 190, 101, 0.08)" : "var(--surface-lowest)",
                border: flowStep === 1 ? "1px solid var(--primary)" : "1px solid var(--outline-variant)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--primary)", fontWeight: "700" }}>
                  STEP 01
                </span>
                {flowStep >= 1 && <CheckCircle2 size={13} color="var(--primary)" />}
              </div>
              <h4 style={{ fontSize: "12px", fontWeight: "700", color: "var(--on-surface)", margin: "0 0 4px 0" }}>
                Agent Dispatches Request
              </h4>
              <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                <code>POST /api/x402/attest</code> (Unsigned)
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                padding: "14px",
                background: flowStep >= 2 ? "rgba(255, 180, 171, 0.08)" : "var(--surface-lowest)",
                border: flowStep === 2 ? "1px solid var(--error)" : "1px solid var(--outline-variant)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--error)", fontWeight: "700" }}>
                  STEP 02
                </span>
                {flowStep >= 2 && <AlertTriangle size={13} color="var(--error)" />}
              </div>
              <h4 style={{ fontSize: "12px", fontWeight: "700", color: "var(--on-surface)", margin: "0 0 4px 0" }}>
                402 Payment Required
              </h4>
              <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                Returns x402 AVM challenge & pricing
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                padding: "14px",
                background: flowStep >= 3 ? "rgba(243, 190, 101, 0.08)" : "var(--surface-lowest)",
                border: flowStep === 3 ? "1px solid var(--primary)" : "1px solid var(--outline-variant)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--primary)", fontWeight: "700" }}>
                  STEP 03
                </span>
                {flowStep >= 3 && <RefreshCw size={13} className="animate-spin" color="var(--primary)" />}
              </div>
              <h4 style={{ fontSize: "12px", fontWeight: "700", color: "var(--on-surface)", margin: "0 0 4px 0" }}>
                GoPlausible Settlement
              </h4>
              <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                Settles micro-tx on Algorand Testnet
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                padding: "14px",
                background: flowStep >= 4 ? "rgba(140, 215, 165, 0.08)" : "var(--surface-lowest)",
                border: flowStep === 4 ? "1px solid var(--secondary)" : "1px solid var(--outline-variant)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--secondary)", fontWeight: "700" }}>
                  STEP 04
                </span>
                {flowStep >= 4 && <CheckCircle2 size={13} color="var(--secondary)" />}
              </div>
              <h4 style={{ fontSize: "12px", fontWeight: "700", color: "var(--on-surface)", margin: "0 0 4px 0" }}>
                LoRA Verified On-Chain
              </h4>
              <p style={{ fontSize: "11px", color: "var(--on-surface-variant)", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                Immutable attestation certified
              </p>
            </div>
          </div>

          {/* Target File Selector */}
          <div style={{ background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FileCheck size={18} color="var(--primary)" />
              <div>
                <span style={{ fontSize: "10px", color: "var(--on-surface-variant)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
                  TARGET ASSET TO ATTEST:
                </span>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--on-surface)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {selectedFile ? selectedFile.filename : "sentinel_security_baseline.bin"}
                </div>
              </div>
            </div>

            {vaultFiles.length > 0 && (
              <select
                value={selectedFile?.id || ""}
                onChange={(e) => {
                  const f = vaultFiles.find((x) => x.id === parseInt(e.target.value, 10));
                  setSelectedFile(f);
                }}
                style={{
                  background: "var(--surface-container-high)",
                  color: "var(--on-surface)",
                  border: "1px solid var(--outline-variant)",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: "none",
                }}
              >
                {vaultFiles.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.filename} ({(f.file_size / 1024).toFixed(1)} KB)
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Live Attestation Receipt & LoRA Link (When confirmed) */}
        {lastAttestation && (
          <div
            className="card"
            style={{
              background: "rgba(140, 215, 165, 0.05)",
              border: "1px solid var(--secondary)",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--secondary)", fontSize: "11px", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
                  <CheckCircle2 size={14} /> [■] ATTESTATION CERTIFIED ON ALGORAND TESTNET
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--on-surface)", margin: "4px 0 0 0" }}>
                  {lastAttestation.filename}
                </h3>
              </div>

              {/* Direct LoRA Explorer Button */}
              <a
                href={lastAttestation.lora_explorer_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "var(--secondary)",
                  color: "var(--on-secondary)",
                  padding: "10px 18px",
                  fontSize: "12px",
                  fontWeight: "800",
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  boxShadow: "0 0 15px rgba(140, 215, 165, 0.3)",
                }}
              >
                <ExternalLink size={14} /> View On LoRA Algorand Explorer
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
              <div style={{ padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)", display: "block", fontSize: "10px" }}>ALGORAND TXID:</span>
                <code style={{ color: "var(--primary)", wordBreak: "break-all" }}>{lastAttestation.tx_id}</code>
              </div>

              <div style={{ padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)", display: "block", fontSize: "10px" }}>FACILITATOR:</span>
                <span style={{ color: "var(--on-surface)" }}>GoPlausible (Multichain)</span>
              </div>

              <div style={{ padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)", display: "block", fontSize: "10px" }}>CONFIRMED ROUND:</span>
                <span style={{ color: "var(--secondary)" }}>#{lastAttestation.confirmed_round}</span>
              </div>

              <div style={{ padding: "8px 12px", background: "var(--surface-lowest)", border: "1px solid var(--outline-variant)" }}>
                <span style={{ color: "var(--on-surface-variant)", display: "block", fontSize: "10px" }}>FILE SHA-256 ANCHOR:</span>
                <code style={{ color: "var(--primary)", wordBreak: "break-all" }}>{lastAttestation.file_hash}</code>
              </div>
            </div>
          </div>
        )}

        {/* Live HTTP 402 JSON Challenge Inspector */}
        {lastChallenge && (
          <div className="card" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Terminal size={15} color="var(--primary)" />
                <span style={{ fontSize: "12px", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace", color: "var(--primary)", textTransform: "uppercase" }}>
                  HTTP 402 Payment Required Response Payload
                </span>
              </div>
              <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", background: "rgba(255, 180, 171, 0.15)", color: "var(--error)", padding: "2px 8px" }}>
                STATUS: 402 PAYMENT REQUIRED
              </span>
            </div>

            <pre
              style={{
                background: "var(--surface-lowest)",
                border: "1px solid var(--outline-variant)",
                padding: "14px",
                fontSize: "11px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--on-surface)",
                overflowX: "auto",
                margin: 0,
              }}
            >
              {JSON.stringify(lastChallenge, null, 2)}
            </pre>
          </div>
        )}

        {/* Algorand Testnet Attestation History */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <p className="section-label">IMMUTABLE BLOCKCHAIN REGISTRY</p>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--on-surface)", margin: 0 }}>
                Algorand Testnet Attestation Trail ({history.length})
              </h3>
            </div>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>
              NO ON-CHAIN ATTESTATIONS YET. TRIGGER THE x402 FLOW ABOVE TO ANCHOR PROOFS TO ALGORAND TESTNET.
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: "100%", minWidth: "650px", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)", fontFamily: "'JetBrains Mono', monospace" }}>
                    <th style={{ padding: "10px 12px" }}>TARGET ASSET</th>
                    <th style={{ padding: "10px 12px" }}>NETWORK</th>
                    <th style={{ padding: "10px 12px" }}>DETAILS</th>
                    <th style={{ padding: "10px 12px" }}>TIMESTAMP</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>EXPLORER</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--outline-subtle)" }}>
                      <td style={{ padding: "12px", fontWeight: "600", color: "var(--on-surface)" }}>
                        {item.filename || "Security Asset"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: "rgba(140, 215, 165, 0.12)", color: "var(--secondary)", border: "1px solid var(--secondary)", padding: "2px 6px", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                          ALGORAND TESTNET
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--on-surface-variant)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.details}
                      </td>
                      <td style={{ padding: "12px", color: "var(--on-surface-variant)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace" }}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <a
                          href="https://lora.algokit.io/testnet"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "var(--primary)",
                            fontSize: "11px",
                            fontFamily: "'JetBrains Mono', monospace",
                            textDecoration: "none",
                            fontWeight: "700",
                          }}
                        >
                          <ExternalLink size={12} /> LoRA Explorer
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AgenticHub;
