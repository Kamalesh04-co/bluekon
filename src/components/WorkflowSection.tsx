import { useState } from 'react';
import { ArrowRight, Check, Play, RefreshCw, Zap, Server, Shield, Activity, Split } from 'lucide-react';

interface WorkflowSectionProps {
  onViewDemo: () => void;
  onGetStarted: () => void;
}

export function WorkflowSection({ onViewDemo, onGetStarted }: WorkflowSectionProps) {
  const [activeScenario, setActiveScenario] = useState<'failover' | 'canary' | 'ddos'>('failover');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStep, setSimulationStep] = useState(3);

  const scenarios = {
    failover: {
      title: 'Automated Multi-Region Failover',
      description: 'Observe how BlueKon detects upstream datacenter degradation and redirects 100% of ingress queries without a single dropped TCP socket.',
      trigger: 'Latency breach: US-East-1 P99 exceeds 200ms',
      action: 'Sub-second traffic diversion to Frankfurt & Oregon clusters',
      steps: [
        { label: 'eBPF probe detects TCP socket retransmits in US-East-1', status: 'Completed (0.4ms)' },
        { label: 'Autonomous health arbiter invalidates stale endpoint route', status: 'Completed (1.2ms)' },
        { label: 'Global Edge DNS updates BGP anycast route tables', status: 'Completed (14ms)' },
        { label: 'Ingress traffic completely stabilized across backup clusters', status: 'Resolved (0 drops)' },
      ]
    },
    canary: {
      title: 'Progressive Canary Rollout with Auto-Rollback',
      description: 'Deploy new container images with automated statistical error monitoring. If 5xx error rate exceeds 0.02%, rollback happens instantaneously.',
      trigger: 'Git push to production-mesh: release v3.4.1',
      action: 'Weighted 5% -> 25% -> 100% split with real-time canary guard',
      steps: [
        { label: 'Deploy canary pods with sidecar-free eBPF metrics tap', status: 'Completed (2.1s)' },
        { label: 'Shift 5% of production query volume to canary pods', status: 'Completed (Active)' },
        { label: 'Live statistical latency and error comparison evaluated', status: 'Nominal (0.004% 5xx)' },
        { label: 'Automatic promotion to 100% production traffic', status: 'Promoted' },
      ]
    },
    ddos: {
      title: 'Kernel-Level eBPF Rate Throttling',
      description: 'Defend against layer 7 volumetric scrapers and credential stuffing attacks directly in kernel memory before hitting user-space CPU.',
      trigger: 'Spike: 140,000 queries/sec from unauthorized bot IP pool',
      action: 'Kernel XDP packet drop at network interface card',
      steps: [
        { label: 'Unusual query signature identified by BlueKon edge filter', status: 'Identified (0.8ms)' },
        { label: 'Generate dynamic eBPF XDP byte-filter program', status: 'Compiled (2.3ms)' },
        { label: 'Hot-load byte-filter into network driver ring', status: 'Loaded (0.1ms)' },
        { label: '4.2M malicious packets dropped with zero CPU overhead', status: 'Mitigated' },
      ]
    }
  };

  const current = scenarios[activeScenario];

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setSimulationStep(0);
    setTimeout(() => setSimulationStep(1), 350);
    setTimeout(() => setSimulationStep(2), 700);
    setTimeout(() => {
      setSimulationStep(3);
      setSimulationRunning(false);
    }, 1100);
  };

  return (
    <section id="architecture" className="py-20 md:py-28 bg-slate-950/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-blue-400 font-semibold tracking-wide">
              Autonomous Workflows
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-2 [text-wrap:balance]">
              Declarative architecture that defends itself.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed [text-wrap:balance]">
              Software fails. Networks partition. BlueKon codifies operational resilience so your systems heal without human panic.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onViewDemo}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              Open Live Simulator
            </button>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="mt-12 flex flex-wrap gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl max-w-2xl">
          {[
            { id: 'failover', label: 'Multi-Region Failover' },
            { id: 'canary', label: 'Canary Progressive Rollout' },
            { id: 'ddos', label: 'Kernel eBPF Throttling' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveScenario(tab.id as any);
                setSimulationStep(3);
              }}
              className={`flex-1 min-w-[140px] px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeScenario === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workflow Showcase Card */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {current.title}
              </h3>
              <p className="mt-1 text-sm text-slate-300 max-w-2xl">
                {current.description}
              </p>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simulationRunning}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 border border-blue-500/30 rounded-lg transition-colors self-start md:self-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulationRunning ? 'animate-spin' : ''}`} />
              {simulationRunning ? 'Running Simulation...' : 'Re-Run Scenario'}
            </button>
          </div>

          {/* Trigger & Action specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs font-mono">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[11px]">System Trigger Event:</span>
              <span className="text-amber-400 font-semibold mt-0.5 block">{current.trigger}</span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[11px]">Autonomous Remediation:</span>
              <span className="text-emerald-400 font-semibold mt-0.5 block">{current.action}</span>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="space-y-3">
            {current.steps.map((step, idx) => {
              const isPassed = idx <= simulationStep;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                    isPassed
                      ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                      : 'bg-slate-950/20 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                      isPassed ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-900 text-slate-600'
                    }`}>
                      0{idx + 1}
                    </span>
                    <span className="font-medium">{step.label}</span>
                  </div>
                  <span className={`font-mono text-[11px] shrink-0 ${
                    isPassed ? 'text-emerald-400' : 'text-slate-600'
                  }`}>
                    {step.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
