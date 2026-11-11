import { useState } from 'react';
import { 
  LogOut, Server, Activity, ShieldCheck, Zap, Cpu, RefreshCw, 
  Terminal, Globe, ArrowUpRight, CheckCircle2, UserCheck
} from 'lucide-react';
import { signOut, User } from 'firebase/auth';
import { auth } from '../firebase';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'clusters' | 'logs'>('overview');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error('Error signing out', err);
    } finally {
      setLoggingOut(false);
    }
  };

  const clusters = [
    { name: 'prod-mesh-us-east-1', provider: 'AWS EKS', nodes: 24, status: 'Healthy', latency: '4.2ms', rps: '1,420,000' },
    { name: 'prod-mesh-eu-west-1', provider: 'GCP GKE', nodes: 18, status: 'Healthy', latency: '6.8ms', rps: '980,000' },
    { name: 'staging-mesh-us-west-2', provider: 'Bare Metal', nodes: 8, status: 'Healthy', latency: '12.1ms', rps: '124,000' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">BlueKon</span>
            <span className="hidden sm:inline-block text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded">
              Console v3.4
            </span>
          </div>

          {/* User Email & Logout Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[200px]">{user?.email || 'Authenticated User'}</span>
            </div>

            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>{loggingOut ? 'Signing Out...' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Infrastructure Control Plane
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Signed in as <span className="text-blue-400 font-mono">{user?.email}</span> via Firebase Authentication.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All 3 Clusters Synchronized</span>
            </div>
          </div>
        </div>

        {/* Real-time KPI Metric Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xs text-slate-400 font-mono">Aggregated Throughput</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              2,524,000 <span className="text-xs text-slate-400 font-normal">req/s</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 font-mono">
              100% nominal traffic
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xs text-slate-400 font-mono">Global P99 Latency</div>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1 tabular-nums">
              8.4 ms
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              -12% vs last 24h
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xs text-slate-400 font-mono">Active eBPF Hooks</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
              142 probes
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 font-mono">
              0.03% kernel CPU load
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="text-xs text-slate-400 font-mono">Security Auth Mode</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              mTLS 1.3
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              SPIFFE/SPIRE Enforced
            </div>
          </div>
        </div>

        {/* Connected Clusters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Active Production Clusters</h2>
              <p className="text-xs text-slate-400">Zero-agent mesh connectivity across multi-cloud regions</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">3 / 3 Online</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Cluster ID</th>
                  <th className="py-2.5 px-3">Environment</th>
                  <th className="py-2.5 px-3">Nodes</th>
                  <th className="py-2.5 px-3">P99 Latency</th>
                  <th className="py-2.5 px-3">RPS</th>
                  <th className="py-2.5 px-3 text-right">Mesh Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clusters.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-blue-400" />
                      {c.name}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{c.provider}</td>
                    <td className="py-3 px-3 text-slate-300">{c.nodes} pods</td>
                    <td className="py-3 px-3 text-emerald-400">{c.latency}</td>
                    <td className="py-3 px-3 text-slate-300">{c.rps}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded text-[11px]">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Help & Session Note */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Authenticated with Firebase Auth ({auth.currentUser?.email}). No profile or storage data is persisted.
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium underline underline-offset-4"
          >
            Sign Out Now
          </button>
        </div>
      </main>
    </div>
  );
}
