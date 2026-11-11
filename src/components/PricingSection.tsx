import { useState } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export function PricingSection({ onGetStarted, onViewDemo }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Developer Free',
      badge: 'Free Forever',
      price: '$0',
      period: 'forever',
      description: 'Ideal for indie developers, test environments, and staging microservices.',
      cta: 'Get Started Free',
      ctaAction: onGetStarted,
      isPrimary: false,
      features: [
        '500,000 monthly trace events',
        'Up to 10 microservice nodes',
        '7-day high-resolution retention',
        'Standard eBPF zero-agent discovery',
        'Single cloud region support',
        'Community Discord & documentation',
      ],
    },
    {
      name: 'Platform Growth',
      badge: 'Most Popular',
      price: isAnnual ? '$39' : '$49',
      period: isAnnual ? 'per month, billed annually' : 'per month, billed monthly',
      description: 'Built for scaling engineering teams needing automated incident healing.',
      cta: 'Start 14-Day Free Trial',
      ctaAction: onGetStarted,
      isPrimary: true,
      features: [
        '10,000,000 monthly trace events',
        'Unlimited nodes & Kubernetes clusters',
        '30-day full trace replay retention',
        'Autonomous incident healing & failovers',
        'Multi-region global mesh routing',
        'PagerDuty, Slack & Datadog integrations',
        'SOC 2 Type II audit report access',
      ],
    },
    {
      name: 'Enterprise Scale',
      badge: 'Dedicated Mesh',
      price: 'Custom',
      period: 'tailored SLA agreements',
      description: 'For mission-critical banking, healthcare, and hyperscale global architectures.',
      cta: 'View Demo & Talk to Architecture',
      ctaAction: onViewDemo,
      isPrimary: false,
      features: [
        'Bespoke volume & unlimited trace capacity',
        'Dedicated single-tenant control plane',
        '99.999% contractually guaranteed uptime SLA',
        'Air-gapped on-premise deployment option',
        'Custom eBPF kernel security modules',
        '24/7/365 dedicated platform architect',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-slate-950/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-mono text-blue-400 font-semibold tracking-wide">
            Predictable Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mt-2 [text-wrap:balance]">
            Transparent tiers. Zero per-seat hostage fees.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed [text-wrap:balance]">
            Scale on infrastructure volume, not headcount. All tiers include full access to the eBPF kernel engine.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                !isAnnual ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                isAnnual ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                plan.isPrimary
                  ? 'bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-950/50 -translate-y-1'
                  : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {plan.name}
                  </h3>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    plan.isPrimary
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {plan.badge}
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {plan.period}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
                  <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    Included capabilities:
                  </div>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/60">
                <button
                  onClick={plan.ctaAction}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 ${
                    plan.isPrimary
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
