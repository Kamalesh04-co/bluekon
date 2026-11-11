import { useState, useEffect } from 'react';
import { ArrowRight, Play, Server, Activity, ShieldCheck, Zap, Cpu } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
  onGoogleSignIn?: () => void;
}

export function HeroSection({ onGetStarted, onViewDemo, onGoogleSignIn }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<'topology' | 'telemetry' | 'rules'>('topology');
  const [liveRps, setLiveRps] = useState(4821490);
  const [activeNode, setActiveNode] = useState(1);

  // Subtle real-time fluctuation for tabular numbers
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveRps((prev) => prev + Math.floor(Math.random() * 1200 - 580));
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Text Announcement - Clean unboxed text with separators */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tracking-tight">
            <span className="text-blue-400 font-semibold">BlueKon 3.4</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Agent eBPF Mesh Engine</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">Live across 38 Edge Regions</span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold text-white tracking-tight leading-[1.08] [text-wrap:balance]"
          >
            Connect, orchestrate, and observe your distributed infrastructure.
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto [text-wrap:balance]">
            BlueKon unifies microservice telemetry, automated incident workflows, and multi-cloud connectivity into a single high-performance control plane. Zero agent bloat.
          </p>

          {/* Primary & Secondary Buttons + Continue with Google */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 group whitespace-nowrap shrink-0 hover:translate-y-[-1px]"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {onGoogleSignIn && (
              <button
                onClick={onGoogleSignIn}
                className="w-full sm:w-auto px-5 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>
            )}

            <button
              onClick={onViewDemo}
              className="w-full sm:w-auto px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0"
            >
              <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
              View Demo
            </button>
          </div>

          {/* Trust and onboarding details - Clean typography with dot separators */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono">
            <span>500k monthly free events</span>
            <span aria-hidden="true">·</span>
            <span>Instant setup in &lt; 3 minutes</span>
            <span aria-hidden="true">·</span>
            <span>No credit card required</span>
          </div>
        </div>

        {/* Hero Interactive Visual Anchor: BlueKon Control Plane Preview */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Top window chrome */}
            <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                <span className="ml-2 text-xs font-mono text-slate-400">bluekon-mesh-console // production</span>
              </div>

              {/* Segmented control tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTab('topology')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'topology' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mesh Topology
                </button>
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'telemetry' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Live Telemetry
                </button>
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'rules' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Automations
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onViewDemo}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                >
                  Launch Full Demo
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Live Metrics Row inside Console */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-800/80 divide-x divide-slate-800/80 bg-slate-950/40 text-xs font-mono">
              <div className="p-3.5 sm:px-5">
                <div className="text-slate-400 text-[11px]">Global Throughput</div>
                <div className="text-base sm:text-lg font-bold text-white tabular-nums mt-0.5">
                  {liveRps.toLocaleString()} <span className="text-xs text-slate-400 font-normal">req/s</span>
                </div>
              </div>
              <div className="p-3.5 sm:px-5">
                <div className="text-slate-400 text-[11px]">P99 Edge Latency</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 tabular-nums mt-0.5">
                  11.4 ms <span className="text-xs text-slate-400 font-normal">(-18%)</span>
                </div>
              </div>
              <div className="p-3.5 sm:px-5">
                <div className="text-slate-400 text-[11px]">Active Service Nodes</div>
                <div className="text-base sm:text-lg font-bold text-white tabular-nums mt-0.5">
                  142 / 142 <span className="text-xs text-emerald-400 font-normal">healthy</span>
                </div>
              </div>
              <div className="p-3.5 sm:px-5">
                <div className="text-slate-400 text-[11px]">Encryption Status</div>
                <div className="text-base sm:text-lg font-bold text-blue-400 mt-0.5">
                  mTLS 1.3 Strict
                </div>
              </div>
            </div>

            {/* Dynamic Console Body */}
            <div className="p-5 sm:p-6 bg-slate-900/60 min-h-[290px] flex flex-col justify-between">
              {activeTab === 'topology' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Connected Microservices Pipeline</span>
                    <span className="font-mono text-emerald-400">Zero packet loss</span>
                  </div>

                  {/* Visual Node pipeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { id: 1, name: 'Edge Ingress', role: 'Envoy / eBPF Gateway', ping: '1.8ms', status: 'Healthy', icon: Server },
                      { id: 2, name: 'Auth & Policy Guard', role: 'JWT & OPA Engine', ping: '3.2ms', status: 'Healthy', icon: ShieldCheck },
                      { id: 3, name: 'Core Event Pipeline', role: 'Kafka / Debezium Sink', ping: '2.1ms', status: 'Healthy', icon: Zap },
                      { id: 4, name: 'Distributed Storage', role: 'CockroachDB Cluster', ping: '4.6ms', status: 'Healthy', icon: Cpu },
                    ].map((node) => {
                      const Icon = node.icon;
                      const isSelected = activeNode === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setActiveNode(node.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-950/40 border-blue-500/80 shadow-md shadow-blue-950/40'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-blue-400">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                              {node.ping}
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="text-xs font-semibold text-white">{node.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate">{node.role}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span>Inspecting Node #{activeNode}: Live traffic balanced across 16 global edge regions.</span>
                    </div>
                    <button
                      onClick={onViewDemo}
                      className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
                    >
                      Open Full Interactive Sandbox
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'telemetry' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-slate-300 h-52 overflow-y-auto">
                    <div className="text-slate-500">// OpenTelemetry Wire Trace Ingestion</div>
                    <div className="text-blue-400">TRACE [span_id: 89ab32]: GET /v2/inventory -&gt; status: 200 (duration: 3.4ms)</div>
                    <div className="text-slate-300">STREAM [node: us-east-worker-4]: eBPF context switch rate: 12,400/sec (nominal)</div>
                    <div className="text-emerald-400">METRIC [edge-proxy]: mTLS session ticket reused for client session 0x7fa920</div>
                    <div className="text-slate-300">TRACE [span_id: 99bb10]: POST /checkout/order -&gt; db-replica-1 (duration: 4.8ms)</div>
                    <div className="text-blue-400">HEALTH [healthcheck]: 38/38 regions report zero latency anomalies</div>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Autonomous Failover Rule #01</span>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">Active</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      If primary payment pod P99 latency exceeds 120ms for 3 consecutive seconds, automatically shift 100% of ingress traffic to hot backup replica cluster in <code>us-central-mesh-b</code>.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Dynamic eBPF Rate Limiter #02</span>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">Active</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Drop abusive layer 7 requests in kernel space before hitting application sockets. 0 CPU cycle tax on microservice pods.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
