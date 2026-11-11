import { ArrowRight, CheckCircle2, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

interface CaseStudySectionProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export function CaseStudySection({ onGetStarted, onViewDemo }: CaseStudySectionProps) {
  return (
    <section id="case-study" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Image with Measured Contrast Scrim */}
          <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full bg-slate-950 overflow-hidden">
            <img
              src="/src/assets/images/team_platform_engineers_1794418705256.jpg"
              alt="Platform engineers collaborating at BlueKon multi-monitor workstation"
              className="w-full h-full object-cover object-center"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Resilient fallback in case image asset cannot load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback gradient background if image hidden */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent pointer-events-none"
              aria-hidden="true" 
            />

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
              <div className="font-mono text-emerald-400 font-semibold mb-0.5">
                VERIFIED PRODUCTION OUTCOME
              </div>
              <div className="font-medium text-white">
                FinScale Global Payments · 1,420 Microservices Migrated
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Proof & Quantified Metrics */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
                <span>Enterprise Case Study</span>
                <span aria-hidden="true">·</span>
                <span>Infrastructure Migration</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-3 leading-snug [text-wrap:balance]">
                "BlueKon reduced our incident resolution time by 74% and saved $380,000 in telemetry egress."
              </h3>

              <blockquote className="mt-6 text-base text-slate-300 leading-relaxed border-l-0 pl-0">
                "Before BlueKon, debugging cross-region latency spikes meant aggregating logs across three different APM tools and drowning in sampling noise. BlueKon's eBPF mesh gave us complete, zero-sampling trace fidelity on day one. Our mean time to detect dropped from 42 minutes to under 90 seconds."
              </blockquote>

              <div className="mt-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  MT
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Maya Thorne</div>
                  <div className="text-xs text-slate-400">VP of Cloud Engineering &amp; Platform Architecture, FinScale</div>
                </div>
              </div>

              {/* Quantified Impact Cards */}
              <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    -74%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Mean Time to Resolve</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                    $380K
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Annual Egress Saved</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tabular-nums">
                    0.04%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Measured CPU Overhead</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                Get Started Free
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onViewDemo}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors border border-slate-700 whitespace-nowrap shrink-0"
              >
                View Sandbox Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
