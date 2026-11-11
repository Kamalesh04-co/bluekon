import { ArrowRight, Play, Terminal } from 'lucide-react';

interface CtaBannerProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export function CtaBanner({ onGetStarted, onViewDemo }: CtaBannerProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          {/* Background image with measured dark scrim */}
          <img
            src="/src/assets/images/hero_cloud_mesh_1794418705809.jpg"
            alt="BlueKon hyperscale server infrastructure facility"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70"
            aria-hidden="true" 
          />

          {/* Banner Content */}
          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold mb-3">
              <Terminal className="w-4 h-4" />
              <span>Zero-Agent Fast Deploy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Deploy BlueKon to your clusters in under 5 minutes.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed [text-wrap:balance]">
              No kernel rebuilds, no invasive proxies, no sidecars. Hook into your existing Kubernetes or cloud workloads and see live distributed topology instantly.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onGetStarted}
                className="px-7 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 hover:translate-y-[-1px]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewDemo}
                className="px-7 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                View Demo
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
              <span>Free tier forever</span>
              <span aria-hidden="true">·</span>
              <span>Cancel anytime</span>
              <span aria-hidden="true">·</span>
              <span>Enterprise SOC-2 ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
