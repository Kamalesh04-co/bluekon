import { useState } from 'react';
import { Layers, ShieldCheck, Zap, Activity, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface CapabilitiesBentoProps {
  onViewDemo: () => void;
  onGetStarted: () => void;
}

export function CapabilitiesBento({ onViewDemo, onGetStarted }: CapabilitiesBentoProps) {
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  const capabilities = [
    {
      index: '01',
      title: 'Zero-Agent eBPF Discovery',
      subtitle: 'Instant topological mapping without invasive sidecars',
      description: 'BlueKon taps directly into Linux kernel sockets using lightweight eBPF probes. Observe every HTTP/2, gRPC, and PostgreSQL query with less than 0.1% CPU overhead and zero container injection.',
      stats: '0.04% CPU Overhead · Zero sidecars',
      highlights: [
        'Automatic service dependency mapping',
        'Works natively across Kubernetes, ECS, & Bare Metal',
        'Detects silent connection drops and TCP resets',
      ],
      colSpan: 'lg:col-span-7',
    },
    {
      index: '02',
      title: 'Autonomous Incident Self-Healing',
      subtitle: 'Sub-second traffic failovers before on-call is paged',
      description: 'Define declarative routing invariants in code. When downstream microservices begin throwing 5xx errors or breach SLA thresholds, BlueKon redirects traffic to warm fallback replicas in 40ms.',
      stats: '< 40ms Failover Latency · 0% packet loss',
      highlights: [
        'Declarative YAML & Terraform primitives',
        'Multi-cloud automatic ingress rerouting',
        'Automated graceful degradation filters',
      ],
      colSpan: 'lg:col-span-5',
    },
    {
      index: '03',
      title: '100% Trace Retention Without Sampling Loss',
      subtitle: 'Full-fidelity OpenTelemetry distributed telemetry',
      description: 'Never guess which outlier transaction caused an outage. BlueKon compresses and indexes billions of raw traces in real time, giving your engineers complete replay capability for every request.',
      stats: '100% Trace capture · 30-day indexed replay',
      highlights: [
        'Native OpenTelemetry and W3C trace context',
        'Span-level latency percentiles (P50, P90, P99, P99.9)',
        'Zero vendor lock-in with open exports',
      ],
      colSpan: 'lg:col-span-5',
    },
    {
      index: '04',
      title: 'Hardware-Enforced Edge Security Guardrails',
      subtitle: 'WireGuard and strict mTLS 1.3 across every cluster',
      description: 'Isolate sensitive workloads with automated mutual TLS. Certificates are minted, rotated, and cryptographically verified at the edge every 24 hours with zero connection interruption.',
      stats: 'mTLS 1.3 Strict · 24h automatic key rotation',
      highlights: [
        'Cryptographic SPIFFE/SPIRE workload identities',
        'Kernel-level layer 7 firewall rules',
        'SOC 2 Type II and HIPAA compliance ready',
      ],
      colSpan: 'lg:col-span-7',
    },
  ];

  return (
    <section id="capabilities" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono text-blue-400 font-semibold tracking-wide">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-2 [text-wrap:balance]">
            Engineered for resilient, mission-critical infrastructure.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed [text-wrap:balance]">
            Every layer of BlueKon is purpose-built to eliminate operational blind spots, automate failure remediation, and simplify distributed architecture.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {capabilities.map((cap, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={idx}
                className={`${cap.colSpan} p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {cap.index}. CAPABILITY
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {cap.stats}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-4">
                    {cap.title}
                  </h3>
                  <div className="text-xs font-medium text-slate-400 mt-1">
                    {cap.subtitle}
                  </div>

                  <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                    {cap.description}
                  </p>

                  <div className="mt-6 space-y-2 border-t border-slate-800/80 pt-5">
                    {cap.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 flex items-center justify-between border-t border-slate-800/60">
                  <button
                    onClick={onViewDemo}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Test in Live Sandbox
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onGetStarted}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Deploy to your cluster &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
