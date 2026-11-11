export function MetricsStrip() {
  const metrics = [
    { value: '99.999%', label: 'Guaranteed SLA Uptime', context: 'Multi-region fault-tolerant mesh' },
    { value: '< 11.4ms', label: 'P99 Global Latency', context: 'Measured across 38 edge POPs' },
    { value: '4.8B+', label: 'Daily Events Processed', context: 'Zero dropped packets in kernel' },
    { value: '64%', label: 'Mean-Time-To-Resolve Drop', context: 'Achieved in first 30 days of deploy' },
  ];

  const enterpriseLogos = [
    'VectorPay', 'CloudGrid', 'OrbitScale', 'HyperMesh', 'DataSync Labs', 'KernelPeak'
  ];

  return (
    <section className="py-12 border-y border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quantitative Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {metrics.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                {item.value}
              </span>
              <span className="text-sm font-semibold text-slate-200 mt-1">
                {item.label}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                {item.context}
              </span>
            </div>
          ))}
        </div>

        {/* Enterprise Logos Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider shrink-0">
            Trusted by infrastructure &amp; platform teams worldwide
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-semibold text-slate-400">
            {enterpriseLogos.map((logo, idx) => (
              <span key={idx} className="hover:text-slate-200 transition-colors tracking-tight font-mono">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
