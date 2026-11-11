import { useState, useEffect } from 'react';
import { 
  X, Play, Pause, RefreshCw, Activity, Server, ShieldCheck, Zap, 
  Terminal, ArrowRight, CheckCircle2, AlertTriangle, Layers, Cpu
} from 'lucide-react';

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export function InteractiveDemoModal({ isOpen, onClose, onGetStarted }: InteractiveDemoModalProps) {
  const [activeTab, setActiveTab] = useState<'topology' | 'logs' | 'surge' | 'health'>('topology');
  const [selectedNode, setSelectedNode] = useState<string>('api-gateway');
  const [isSimulatingFailure, setIsSimulatingFailure] = useState(false);
  const [rerouted, setRerouted] = useState(false);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const [trafficRps, setTrafficRps] = useState<number>(125000);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(100);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Simulated live event logs
  const [logs, setLogs] = useState([
    { id: '1', time: '12:44:02.102', level: 'info', msg: 'mTLS handshake verified with edge-ingress-us-east (cert_sha: 8f4c...)' },
    { id: '2', time: '12:44:02.148', level: 'info', msg: 'eBPF flow collector dispatched 14,800 telemetry packets to local ring' },
    { id: '3', time: '12:44:02.210', level: 'info', msg: 'Service mesh route healthy: /v1/checkout -> auth-vault (latency: 4.8ms)' },
    { id: '4', time: '12:44:02.320', level: 'warn', msg: 'Kafka partition 04 consumer group rebalance finished in 18ms' },
    { id: '5', time: '12:44:02.404', level: 'info', msg: 'Global DNS routing health score 100% across 38 edge locations' },
  ]);

  useEffect(() => {
    if (!isOpen || !isLogStreaming) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const sampleEvents = [
        { level: 'info', msg: `Dispatched sync burst to us-west-2 replica (24.2ms RTT)` },
        { level: 'info', msg: `Autonomous scaling policy checked: CPU load normal (34%)` },
        { level: 'info', msg: `HTTP/3 stream multiplexed: 2,420 connections active` },
        { level: 'warn', msg: `P99 latency variance +1.2ms on payment-engine-pod-4` },
        { level: 'info', msg: `Distributed trace sample saved to BlueKon storage cluster` }
      ];
      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setLogs(prev => [
        { id: String(Date.now() + Math.random()), time: timeStr, level: randomEvent.level, msg: randomEvent.msg },
        ...prev.slice(0, 24)
      ]);
    }, 1800);
    return () => clearInterval(interval);
  }, [isOpen, isLogStreaming]);

  const handleSimulateHeal = () => {
    setIsSimulatingFailure(true);
    setRerouted(false);
    setTimeout(() => {
      setRerouted(true);
      setIsSimulatingFailure(false);
    }, 1200);
  };

  const handleRunDiagnostics = () => {
    setDiagnosticRunning(true);
    setDiagnosticProgress(15);
    setTimeout(() => setDiagnosticProgress(50), 400);
    setTimeout(() => setDiagnosticProgress(85), 900);
    setTimeout(() => {
      setDiagnosticProgress(100);
      setDiagnosticRunning(false);
    }, 1400);
  };

  if (!isOpen) return null;

  const nodes = [
    { id: 'api-gateway', name: 'Edge Ingress API Gateway', status: 'Healthy', latency: '2.1 ms', rps: '48,200', cpu: '28%', pods: 12 },
    { id: 'auth-service', name: 'Auth & Identity Guard', status: 'Healthy', latency: '4.4 ms', rps: '36,100', cpu: '34%', pods: 8 },
    { 
      id: 'payment-engine', 
      name: 'Transaction Engine', 
      status: isSimulatingFailure ? 'Degraded' : (rerouted ? 'Rerouted (Auto-Healed)' : 'Healthy'), 
      latency: isSimulatingFailure ? '340 ms (Spike)' : (rerouted ? '8.2 ms' : '6.1 ms'), 
      rps: '18,400', 
      cpu: isSimulatingFailure ? '92%' : '41%', 
      pods: isSimulatingFailure ? 4 : (rerouted ? 16 : 8) 
    },
    { id: 'event-stream', name: 'Kafka High-Throughput Bus', status: 'Healthy', latency: '1.2 ms', rps: '120,400', cpu: '22%', pods: 6 },
    { id: 'postgres-cluster', name: 'PostgreSQL Distributed Mesh', status: 'Healthy', latency: '3.8 ms', rps: '14,200', cpu: '38%', pods: 4 },
  ];

  const currentNode = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="demo-title" className="text-base font-semibold text-white tracking-tight">
                  BlueKon Live Interactive Sandbox
                </h3>
                <span className="text-xs text-blue-400 font-mono">Live Simulation</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore real-time topology mapping, automated failure rerouting, and eBPF stream metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('topology')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'topology'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Service Mesh Topology
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Live Telemetry Stream
            </button>

            <button
              onClick={() => setActiveTab('surge')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'surge'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Traffic Surge Simulator
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'health'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Health & Security Audit
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>Active Edge: us-east-1</span>
            <span aria-hidden="true">·</span>
            <span>Latency: 11.2ms</span>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'topology' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs font-medium text-slate-200">Interactive Mesh Control</div>
                  <div className="text-[11px] text-slate-400">Click any service node below to inspect live telemetry or trigger simulated traffic failover.</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateHeal}
                    disabled={isSimulatingFailure}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-amber-950/60 border border-amber-700/50 hover:bg-amber-900/60 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    {isSimulatingFailure ? 'Simulating Spike...' : 'Trigger Latency Spike & Test Auto-Heal'}
                  </button>
                  {rerouted && (
                    <button
                      onClick={() => setRerouted(false)}
                      className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                    >
                      Reset State
                    </button>
                  )}
                </div>
              </div>

              {/* Service Topology Interactive Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {nodes.map((node) => {
                  const isSelected = node.id === selectedNode;
                  const isFailed = node.id === 'payment-engine' && isSimulatingFailure;
                  const isHealed = node.id === 'payment-engine' && rerouted;

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-950/50' 
                          : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                          {node.id.includes('gateway') ? <Server className="w-3.5 h-3.5" /> :
                           node.id.includes('auth') ? <ShieldCheck className="w-3.5 h-3.5" /> :
                           node.id.includes('stream') ? <Zap className="w-3.5 h-3.5" /> :
                           <Cpu className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isFailed ? 'bg-red-950 text-red-400 border border-red-800/50' :
                          isHealed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {node.status}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs font-semibold text-white leading-tight">{node.name}</div>
                        <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-400 font-mono">
                          <div>Latency: <span className="text-slate-200">{node.latency}</span></div>
                          <div>CPU: <span className="text-slate-200">{node.cpu}</span></div>
                          <div className="col-span-2">RPS: <span className="text-slate-200">{node.rps}</span></div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Inspection Drawer */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-white">{currentNode.name}</span>
                    <span className="text-xs text-slate-400 font-mono">id: {currentNode.id}</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    eBPF Kernel Probes Active
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="text-slate-400 text-[11px]">Reported P99 Latency</div>
                    <div className="text-base font-semibold text-white mt-0.5">{currentNode.latency}</div>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="text-slate-400 text-[11px]">Throughput (req/sec)</div>
                    <div className="text-base font-semibold text-white mt-0.5">{currentNode.rps}</div>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="text-slate-400 text-[11px]">Active Pod Replicas</div>
                    <div className="text-base font-semibold text-white mt-0.5">{currentNode.pods} instances</div>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="text-slate-400 text-[11px]">CPU Allocation</div>
                    <div className="text-base font-semibold text-white mt-0.5">{currentNode.cpu}</div>
                  </div>
                </div>

                {rerouted && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-700/40 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Autonomous Failover executed: 100% of transaction traffic smoothly routed to fallback cluster <strong>us-central-mesh-b</strong> in 82ms. Zero dropped requests.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLogStreaming(!isLogStreaming)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {isLogStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    {isLogStreaming ? 'Pause Stream' : 'Resume Stream'}
                  </button>
                  <button
                    onClick={() => setLogs([])}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear Console
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  {(['all', 'info', 'warn', 'error'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setLogFilter(f)}
                      className={`px-2.5 py-1 rounded capitalize font-mono text-[11px] transition-colors ${
                        logFilter === f ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Log Terminal Window */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 h-80 overflow-y-auto space-y-1.5">
                {logs
                  .filter(l => logFilter === 'all' || l.level === logFilter)
                  .map(log => (
                    <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/60 p-1 rounded transition-colors">
                      <span className="text-slate-500 shrink-0 text-[11px]">{log.time}</span>
                      <span className={`px-1 rounded text-[10px] uppercase font-bold shrink-0 ${
                        log.level === 'warn' ? 'bg-amber-950 text-amber-400' :
                        log.level === 'error' ? 'bg-red-950 text-red-400' :
                        'bg-blue-950 text-blue-400'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-slate-200 break-all">{log.msg}</span>
                    </div>
                  ))}
                {logs.length === 0 && (
                  <div className="text-center py-12 text-slate-500">Log console cleared. Waiting for next telemetry emission...</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'surge' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Dynamic Throughput Load Generator</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Drag slider to simulate incoming traffic spikes and observe BlueKon's elastic pod autoscaler response.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
                      {trafficRps.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 block font-mono">requests / sec</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={25000}
                  value={trafficRps}
                  onChange={(e) => setTrafficRps(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>10,000 RPS (Baseline)</span>
                  <span>1,000,000 RPS (High)</span>
                  <span>5,000,000 RPS (Hyperscale Spike)</span>
                </div>
              </div>

              {/* Reactive System Output */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-400">Allocated Edge Nodes</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                    {Math.max(4, Math.floor(trafficRps / 45000))} instances
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-2 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Auto-balanced across 3 zones
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-400">Estimated Global Latency</div>
                  <div className="text-2xl font-bold font-mono text-blue-400 mt-1 tabular-nums">
                    {(8.2 + (trafficRps / 1000000) * 1.4).toFixed(1)} ms
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    Under strict 20ms SLA limit
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div className="text-xs text-slate-400">Mesh Health Status</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    100.0% Nominal
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    Zero dropped packets (eBPF)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div>
                  <h4 className="text-sm font-semibold text-white">Full Security & Mesh Diagnostic Run</h4>
                  <p className="text-xs text-slate-400">Audit TLS 1.3 mutual auth, eBPF probe compliance, and multi-region replication consistency.</p>
                </div>
                <button
                  onClick={handleRunDiagnostics}
                  disabled={diagnosticRunning}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? 'animate-spin' : ''}`} />
                  {diagnosticRunning ? 'Auditing Mesh...' : 'Run Diagnostics'}
                </button>
              </div>

              {/* Benchmark items */}
              <div className="space-y-2.5">
                {[
                  { name: 'Hardware-Enforced mTLS 1.3 Verification', spec: '142 / 142 microservices compliant', pass: true },
                  { name: 'Kernel eBPF Hook Overhead', spec: '0.04% CPU tax (within 0.1% target)', pass: true },
                  { name: 'Automated TLS Certificate Expiry Audit', spec: 'Next automatic rotation in 42 days', pass: true },
                  { name: 'Multi-Region Replication Lag (us-east to eu-west)', spec: '3.1ms synchronization delta', pass: true },
                  { name: 'SOC 2 Type II Invariant Verification', spec: 'All immutable audit logs signed & cryptographically sealed', pass: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{item.spec}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      VERIFIED PASS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Ready to deploy this control plane to your own infrastructure?
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Close Demo
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
