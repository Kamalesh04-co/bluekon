import { Activity } from 'lucide-react';

interface FooterProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export function Footer({ onGetStarted, onViewDemo }: FooterProps) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                BK
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">BlueKon</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The unified cloud connectivity and observability platform. Connect, orchestrate, and observe distributed infrastructure with zero-agent eBPF technology.
            </p>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>All 38 Global Edge Points Operational</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Platform
            </div>
            <ul className="space-y-2">
              <li><a href="#capabilities" className="hover:text-white transition-colors">eBPF Mesh</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Autonomous Healing</a></li>
              <li><button onClick={onViewDemo} className="hover:text-white transition-colors text-left">Interactive Demo</button></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing &amp; Tiers</a></li>
              <li><button onClick={onGetStarted} className="text-blue-400 hover:text-blue-300 transition-colors text-left font-medium">Free Developer Tier</button></li>
            </ul>
          </div>

          {/* Solutions & Architecture */}
          <div>
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Solutions
            </div>
            <ul className="space-y-2">
              <li><a href="#architecture" className="hover:text-white transition-colors">Kubernetes Mesh</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Multi-Region Routing</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Layer 7 DDoS Shield</a></li>
              <li><a href="#case-study" className="hover:text-white transition-colors">FinScale Case Study</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">mTLS 1.3 Strict</a></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Compliance &amp; Docs
            </div>
            <ul className="space-y-2">
              <li><span className="hover:text-white cursor-pointer transition-colors">SOC 2 Type II</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Security Whitepaper</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">OpenTelemetry Spec</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} BlueKon Systems, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Status</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-400 cursor-pointer">GitHub</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Audit</span>
            <span aria-hidden="true">&middot;</span>
            <span className="hover:text-slate-400 cursor-pointer">API Reference</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
