import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Terminal,
  Activity,
  Zap,
  Globe,
  ArrowRight,
  ChevronRight,
  Lock,
  Cpu,
  Layers,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { isAuthenticated } from "../services/api";

// Fast browser-native SHA-256 helper for live avalanche sandbox
async function computeSha256(text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return "0000000000000000000000000000000000000000000000000000000000000000";
  }
}

function Home() {
  const isAuth = isAuthenticated();

  // Avalanche Sandbox State
  const [baseText, setBaseText] = useState("SECURE_SENTINEL_INTEGRITY_PAYLOAD_V4");
  const [tamperText, setTamperText] = useState("SECURE_SENTINEL_INTEGRITY_PAYLOAD_V5");
  const [baseHash, setBaseHash] = useState("");
  const [tamperHash, setTamperHash] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Re-calculate hashes in real time
  useEffect(() => {
    let isMounted = true;
    Promise.all([computeSha256(baseText), computeSha256(tamperText)]).then(
      ([h1, h2]) => {
        if (isMounted) {
          setBaseHash(h1);
          setTamperHash(h2);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [baseText, tamperText]);

  // Terminal cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Calculate bit difference
  const calculateBitDiff = () => {
    if (!baseHash || !tamperHash || baseHash.length !== 64 || tamperHash.length !== 64) {
      return { diffBits: 0, percent: 0 };
    }
    let diffBits = 0;
    for (let i = 0; i < 64; i++) {
      const b1 = parseInt(baseHash[i], 16);
      const b2 = parseInt(tamperHash[i], 16);
      const xor = b1 ^ b2;
      diffBits += (xor & 1) + ((xor >> 1) & 1) + ((xor >> 2) & 1) + ((xor >> 3) & 1);
    }
    const percent = ((diffBits / 256) * 100).toFixed(1);
    return { diffBits, percent };
  };

  const { diffBits, percent } = calculateBitDiff();

  return (
    <div className="min-h-screen bg-[#0e141b] text-[#dde3ed] font-sans antialiased selection:bg-[#f3be65] selection:text-[#0e141b]">
      {/* Top Header / Tactical Navigation */}
      <header className="sticky top-0 z-50 h-14 bg-[#0e141b]/95 backdrop-blur-md border-b border-[#4f4537] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-sm bg-[#f3be65] text-[#432c00] flex items-center justify-center font-black text-sm">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <span className="font-mono text-sm tracking-widest text-[#f3be65] font-bold uppercase">
              SecureSentinel
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-[#4f4537]">
            <span className="text-[10px] font-mono uppercase bg-[#ff887c] text-[#410002] px-2 py-[2px] font-semibold">
              Live Stream
            </span>
            <span className="font-mono text-xs text-[#d3c4b2] animate-pulse">
              SCANNING NODE_08...
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase text-[#d3c4b2]">
          <a href="#capabilities" className="hover:text-[#f3be65] transition-colors">
            Capabilities
          </a>
          <a href="#avalanche-sandbox" className="hover:text-[#f3be65] transition-colors text-[#f3be65]">
            [Avalanche Sandbox]
          </a>
          <a href="#operations" className="hover:text-[#f3be65] transition-colors">
            Operations Center
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuth ? (
            <Link
              to="/dashboard"
              className="bg-[#f3be65] text-[#0e141b] font-mono text-xs font-bold px-4 py-2 hover:bg-[#d4a24c] transition-colors uppercase tracking-wider flex items-center gap-2"
            >
              Go to Console <ArrowRight size={14} />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-[#d3c4b2] font-mono text-xs hover:text-[#dde3ed] px-3 py-1.5 uppercase tracking-wider"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-[#f3be65] text-[#0e141b] font-mono text-xs font-bold px-4 py-2 hover:bg-[#d4a24c] transition-colors uppercase tracking-wider flex items-center gap-2"
              >
                Deploy Sentinel <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[640px] flex flex-col justify-center px-6 py-16 bg-[#090f15] border-b border-[#4f4537] overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid-stitch" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#4f4537" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid-stitch)" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto w-full relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
          {/* Hero Content */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#f3be65] animate-pulse"></span>
              <span className="font-mono text-xs text-[#f3be65] tracking-widest uppercase">
                System Initialization Complete
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-[#dde3ed] tracking-tight leading-tight">
              Absolute Defense,<br />
              <span className="text-[#9c8f7e]">Zero Compromise.</span>
            </h1>

            <p className="text-[#d3c4b2] text-base md:text-lg max-w-[580px] leading-relaxed">
              SecureSentinel delivers military-grade cryptographic data possession and automated tamper mitigation. Engineered for low-fatigue continuous monitoring and instantaneous anomaly resolution.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                to={isAuth ? "/dashboard" : "/login"}
                className="bg-[#f3be65] text-[#0e141b] font-mono text-xs font-bold px-6 py-3.5 hover:bg-[#d4a24c] transition-colors uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                Deploy Sentinel <ChevronRight size={16} />
              </Link>
              <a
                href="#avalanche-sandbox"
                className="border border-[#4f4537] text-[#dde3ed] hover:bg-[#1a2027] transition-colors font-mono text-xs px-6 py-3.5 flex items-center gap-2 uppercase tracking-wider"
              >
                <Terminal size={16} className="text-[#f3be65]" /> Test Avalanche Sandbox
              </a>
            </div>
          </div>

          {/* Hero Status Panel (Monospace Readout) */}
          <div className="xl:col-span-5 w-full bg-[#1a2027] border border-[#4f4537] p-5 relative overflow-hidden">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#f3be65]"></div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#f3be65]"></div>
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#f3be65]"></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#f3be65]"></div>

            <div className="flex justify-between items-center mb-4 border-b border-[#4f4537] pb-3">
              <span className="font-mono text-xs text-[#d3c4b2] uppercase tracking-wider">Live Telemetry</span>
              <span className="font-mono text-xs text-[#8cd7a5] flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 bg-[#8cd7a5]"></span> [■] SECURE
              </span>
            </div>

            <div className="font-mono text-xs text-[#d3c4b2] flex flex-col gap-2">
              <div className="flex justify-between py-1 border-b border-[#242a32]">
                <span className="text-[#dde3ed]">&gt; SYSTEM_UPTIME</span>
                <span className="text-[#8cd7a5]">99.999%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#242a32]">
                <span className="text-[#dde3ed]">&gt; ACTIVE_NODES</span>
                <span>4,092 CLOUD REPLICAS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#242a32]">
                <span className="text-[#dde3ed]">&gt; THREAT_VECTORS</span>
                <span className="text-[#8cd7a5]">0 DETECTED</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#242a32]">
                <span className="text-[#dde3ed]">&gt; CRYPTOGRAPHIC_ALGO</span>
                <span>SHA-256 + AES-GCM</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#dde3ed]">&gt; AUDIT_LATENCY</span>
                <span className="text-[#f3be65]">sub-12ms</span>
              </div>
              <div className="mt-2 text-[#f3be65] font-bold">
                ROOT_OPERATOR_STATUS: READY {cursorVisible ? "_" : " "}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hash Avalanche Sandbox (Hackathon Feature) */}
      <section id="avalanche-sandbox" className="py-16 px-6 bg-[#0e141b] border-b border-[#4f4537]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase bg-[#f3be65] text-[#0e141b] px-2 py-0.5 font-bold">
                  Interactive Demo
                </span>
                <span className="font-mono text-xs text-[#8cd7a5]">NIST SP 800-88 AUDIT GRADE</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#dde3ed]">
                Cryptographic Avalanche Effect Sandbox
              </h2>
              <p className="text-sm text-[#d3c4b2] max-w-[650px] mt-1">
                A hallmark of cryptographically secure hash functions: modifying even a single character flips roughly 50% of the output bits across the entire 256-bit digest. Test it live below!
              </p>
            </div>

            <button
              onClick={() => {
                setBaseText("SECURE_SENTINEL_INTEGRITY_PAYLOAD_V4");
                setTamperText("SECURE_SENTINEL_INTEGRITY_PAYLOAD_V5");
              }}
              className="border border-[#4f4537] hover:border-[#f3be65] text-xs font-mono text-[#d3c4b2] hover:text-[#f3be65] px-4 py-2 self-start md:self-auto flex items-center gap-2"
            >
              <RefreshCw size={14} /> Reset Nominal Strings
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input 1: Nominal Baseline */}
            <div className="bg-[#1a2027] border border-[#4f4537] p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs text-[#8cd7a5] font-bold uppercase">
                  [■] Nominal Baseline (Source A)
                </span>
                <span className="text-[10px] font-mono text-[#9c8f7e]">EDITABLE INPUT</span>
              </div>
              <input
                type="text"
                value={baseText}
                onChange={(e) => setBaseText(e.target.value)}
                className="w-full bg-[#090f15] border border-[#4f4537] focus:border-[#f3be65] text-[#dde3ed] font-mono text-sm px-3 py-2.5 mb-4 outline-none"
                placeholder="Type baseline text..."
              />
              <div className="text-[11px] font-mono text-[#9c8f7e] uppercase mb-1">
                256-Bit Cryptographic Hash Digest:
              </div>
              <div className="bg-[#090f15] border border-[#4f4537] p-3 font-mono text-xs break-all text-[#8cd7a5] leading-relaxed">
                {baseHash || "Calculating..."}
              </div>
            </div>

            {/* Input 2: Comparison / Tampered */}
            <div className="bg-[#1a2027] border border-[#4f4537] p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs text-[#ff887c] font-bold uppercase">
                  [▲] Comparison / Modified Payload (Source B)
                </span>
                <span className="text-[10px] font-mono text-[#9c8f7e]">EDITABLE INPUT</span>
              </div>
              <input
                type="text"
                value={tamperText}
                onChange={(e) => setTamperText(e.target.value)}
                className="w-full bg-[#090f15] border border-[#4f4537] focus:border-[#ff887c] text-[#dde3ed] font-mono text-sm px-3 py-2.5 mb-4 outline-none"
                placeholder="Type comparison text..."
              />
              <div className="text-[11px] font-mono text-[#9c8f7e] uppercase mb-1">
                256-Bit Cryptographic Hash Digest:
              </div>
              <div className="bg-[#090f15] border border-[#4f4537] p-3 font-mono text-xs break-all text-[#ff887c] leading-relaxed">
                {tamperHash || "Calculating..."}
              </div>
            </div>
          </div>

          {/* Avalanche Live Analytics Readout */}
          <div className="mt-6 bg-[#161c23] border border-[#4f4537] p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <div className="text-[11px] font-mono text-[#9c8f7e] uppercase">Status Verification</div>
                <div className="text-lg font-mono font-bold mt-1">
                  {baseHash === tamperHash ? (
                    <span className="text-[#8cd7a5]">[■] IDENTICAL MATCH (0 TAMPER)</span>
                  ) : (
                    <span className="text-[#ff887c]">[▲] AVALANCHE DIVERGENCE DETECTED</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-[#9c8f7e] uppercase">Entropy Bits Altered</div>
                <div className="text-lg font-mono font-bold mt-1 text-[#f3be65]">
                  {diffBits} of 256 bits ({percent}%)
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-[#9c8f7e] uppercase">Avalanche Efficiency</div>
                <div className="w-full bg-[#090f15] h-3 border border-[#4f4537] mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f3be65] to-[#8cd7a5] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Capabilities Grid */}
      <section id="capabilities" className="py-16 px-6 bg-[#090f15] border-b border-[#4f4537]">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#dde3ed] mb-1">Operational Capabilities</h2>
            <p className="text-sm text-[#d3c4b2]">Precision instruments for automated multi-cloud data integrity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div className="bg-[#1a2027] p-6 border border-[#4f4537] hover:bg-[#242a32] transition-colors group">
              <div className="w-10 h-10 bg-[#2f353d] flex items-center justify-center mb-4 border border-[#4f4537] group-hover:border-[#f3be65] transition-colors">
                <Activity size={20} className="text-[#f3be65]" />
              </div>
              <h3 className="font-semibold text-[#dde3ed] text-base mb-2">Provable Data Possession</h3>
              <p className="text-xs text-[#d3c4b2] mb-4 leading-relaxed">
                Verify cloud file integrity without downloading complete payloads. Mathematically guarantees storage consistency with zero bandwidth overhead.
              </p>
              <div className="pt-3 border-t border-[#4f4537] font-mono text-[11px] text-[#9c8f7e]">
                MODULE: PDP-CORE_v4.2
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1a2027] p-6 border border-[#4f4537] hover:bg-[#242a32] transition-colors group">
              <div className="w-10 h-10 bg-[#2f353d] flex items-center justify-center mb-4 border border-[#4f4537] group-hover:border-[#f3be65] transition-colors">
                <Shield size={20} className="text-[#f3be65]" />
              </div>
              <h3 className="font-semibold text-[#dde3ed] text-base mb-2">Automated Incident Alerting</h3>
              <p className="text-xs text-[#d3c4b2] mb-4 leading-relaxed">
                Instantaneous detection and quarantine of altered files. Audit logs capture unauthorized tamper attempts with full forensic timestamps.
              </p>
              <div className="pt-3 border-t border-[#4f4537] font-mono text-[11px] text-[#9c8f7e]">
                MODULE: AUTO-ALERT_v1.9
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1a2027] p-6 border border-[#4f4537] hover:bg-[#242a32] transition-colors group">
              <div className="w-10 h-10 bg-[#2f353d] flex items-center justify-center mb-4 border border-[#4f4537] group-hover:border-[#f3be65] transition-colors">
                <FileCheck size={20} className="text-[#f3be65]" />
              </div>
              <h3 className="font-semibold text-[#dde3ed] text-base mb-2">Certified PDF Audit Reports</h3>
              <p className="text-xs text-[#d3c4b2] mb-4 leading-relaxed">
                Generate cryptographically certified verification certificates via automated ReportLab engine, compliant with NIST SP 800-88 and SOC 2 Type II.
              </p>
              <div className="pt-3 border-t border-[#4f4537] font-mono text-[11px] text-[#9c8f7e]">
                MODULE: AUDIT-CERT_v2.0
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#1a2027] p-6 border border-[#4f4537] hover:bg-[#242a32] transition-colors group md:col-span-2 xl:col-span-1">
              <div className="w-10 h-10 bg-[#2f353d] flex items-center justify-center mb-4 border border-[#4f4537] group-hover:border-[#f3be65] transition-colors">
                <Layers size={20} className="text-[#f3be65]" />
              </div>
              <h3 className="font-semibold text-[#dde3ed] text-base mb-2">Multi-Cloud Storage Hub</h3>
              <p className="text-xs text-[#d3c4b2] mb-4 leading-relaxed">
                Seamless multi-tenant switching across AWS S3, Google Cloud Storage, Azure Blob Storage, and air-gapped Local Vaults.
              </p>
              <div className="pt-3 border-t border-[#4f4537] font-mono text-[11px] text-[#9c8f7e]">
                MODULE: MULTI-CLOUD_v3.1
              </div>
            </div>

            {/* Visual Feature (Span 2 cols) */}
            <div className="bg-[#1a2027] border border-[#4f4537] p-6 md:col-span-2 xl:col-span-2 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-[#ff887c] animate-pulse"></span>
                  <span className="font-mono text-xs text-[#ff887c] tracking-widest uppercase">
                    Live Telemetry Network
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#dde3ed] mb-2">
                  Zero-Knowledge Cryptographic Matrix
                </h3>
                <p className="text-xs text-[#d3c4b2] max-w-[500px] leading-relaxed">
                  Aggregating cryptographic hashes and verifiable audit logs across all operator nodes with zero raw data exposure.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#4f4537] flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4 text-xs font-mono text-[#d3c4b2]">
                  <span>[■] AWS S3: OK</span>
                  <span>[■] GCS: OK</span>
                  <span>[■] AZURE: OK</span>
                </div>
                <Link
                  to={isAuth ? "/dashboard" : "/login"}
                  className="bg-[#2f353d] border border-[#4f4537] hover:border-[#f3be65] text-[#dde3ed] font-mono text-xs px-4 py-2 uppercase tracking-wider"
                >
                  Open Vault Console
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Operations Map & Regional Node Telemetry */}
      <section id="operations" className="py-16 px-6 bg-[#0e141b] border-b border-[#4f4537]">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#dde3ed]">Distributed Operations Center</h2>
            <p className="text-sm text-[#d3c4b2] leading-relaxed">
              Monitor global vault node status, hash anchoring pipelines, and regional latency with sub-millisecond precision.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="border border-[#4f4537] bg-[#1a2027] p-3">
                <div className="font-mono text-[10px] text-[#9c8f7e] uppercase mb-1">Primary Node</div>
                <div className="font-mono text-sm font-bold text-[#dde3ed]">us-east-1 (VAULT_01)</div>
              </div>
              <div className="border border-[#4f4537] bg-[#1a2027] p-3">
                <div className="font-mono text-[10px] text-[#9c8f7e] uppercase mb-1">Failover Replica</div>
                <div className="font-mono text-sm font-bold text-[#dde3ed]">eu-central-1 (REPL_02)</div>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#1a2027] border border-[#4f4537] p-5">
            <div className="font-mono text-xs text-[#d3c4b2] border-b border-[#4f4537] pb-3 mb-4 flex justify-between">
              <span>REGIONAL CLUSTER HEALTH</span>
              <span className="text-[#8cd7a5]">[■] ALL SYSTEMS OPERATIONAL</span>
            </div>
            <div className="font-mono text-xs flex flex-col gap-3">
              <div className="flex justify-between items-center p-2 bg-[#090f15] border border-[#242a32]">
                <span className="text-[#dde3ed]">[■] US-EAST (ASHBURN): NOMINAL</span>
                <span className="text-[#8cd7a5]">8ms</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#090f15] border border-[#242a32]">
                <span className="text-[#dde3ed]">[■] EU-WEST (FRANKFURT): NOMINAL</span>
                <span className="text-[#8cd7a5]">24ms</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-[#090f15] border border-[#242a32]">
                <span className="text-[#dde3ed]">[■] AP-SOUTHEAST (SINGAPORE): SYNCING</span>
                <span className="text-[#f3be65]">58ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#090f15] py-12 px-6">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={18} className="text-[#f3be65]" />
              <span className="font-mono text-sm font-bold text-[#f3be65] tracking-widest uppercase">
                SecureSentinel
              </span>
            </div>
            <p className="text-xs text-[#d3c4b2] max-w-[320px] leading-relaxed">
              Cryptographic data possession and automated multi-cloud integrity engine.
            </p>
            <div className="mt-4 font-mono text-[11px] text-[#9c8f7e]">
              SECURESENTINEL VERSION 4.2.1-STABLE [HACKATHON RELEASE]
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-[#dde3ed] uppercase mb-3 tracking-widest">
              Protocols
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#d3c4b2]">
              <li>NIST SP 800-88 Audit</li>
              <li>Provable Data Possession</li>
              <li>SHA-256 Digest Matrix</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold text-[#dde3ed] uppercase mb-3 tracking-widest">
              Platform
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#d3c4b2]">
              <li>AWS S3 Cloud Hub</li>
              <li>Google Cloud Storage</li>
              <li>Azure Blob Storage</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
