import { useState, useEffect } from 'react';
import { 
  X, Check, ArrowRight, Copy, CheckCheck, 
  Terminal, Server, Play, ShieldCheck, CheckCircle2
} from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDemo: () => void;
}

export function GetStartedModal({ isOpen, onClose, onViewDemo }: GetStartedModalProps) {
  const [platform, setPlatform] = useState<'shell' | 'k8s' | 'docker' | 'terraform'>('shell');
  const [region, setRegion] = useState('us-east-1');
  const [copied, setCopied] = useState(false);

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

  if (!isOpen) return null;

  const commands = {
    shell: `curl -sSL https://install.bluekon.io/v3/quickstart.sh | sh -s -- --region=${region} --mode=zero-agent`,
    k8s: `helm repo add bluekon https://charts.bluekon.io
helm repo update
helm install bluekon-mesh bluekon/agent \\
  --namespace bluekon-system \\
  --create-namespace \\
  --set cluster.region=${region}`,
    docker: `docker run -d --name bluekon-agent \\
  --restart always \\
  --privileged \\
  --net=host \\
  -v /sys/kernel/debug:/sys/kernel/debug:ro \\
  -e BLUEKON_REGION=${region} \\
  ghcr.io/bluekon/ebpf-agent:v3.4`,
    terraform: `module "bluekon_mesh" {
  source     = "bluekon/mesh/cloud"
  region     = "${region}"
  monitoring = "ebpf-strict"
}`
  };

  const activeCommand = commands[platform];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickstart-title"
      >
        {/* Header - Zero Login Required */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-wider">
              BK
            </div>
            <div>
              <h3 id="quickstart-title" className="text-base font-semibold text-white">
                Instant Cluster Deployment
              </h3>
              <p className="text-xs text-slate-400">
                Zero login or account registration required · Instant eBPF connection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Platform Selector Tabs */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Select Deployment Target
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'shell', label: 'Linux (eBPF Shell)' },
                { id: 'k8s', label: 'Kubernetes / Helm' },
                { id: 'docker', label: 'Docker Container' },
                { id: 'terraform', label: 'Terraform Module' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPlatform(item.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    platform === item.id
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Region selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <span className="text-slate-400">Nearest Edge Mesh Point:</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="us-east-1">us-east-1 (N. Virginia · 8ms)</option>
              <option value="us-west-2">us-west-2 (Oregon · 12ms)</option>
              <option value="eu-central-1">eu-central-1 (Frankfurt · 14ms)</option>
              <option value="ap-southeast-1">ap-southeast-1 (Singapore · 16ms)</option>
            </select>
          </div>

          {/* Generated Code Window */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                Run in your cluster or terminal:
              </span>
              <span className="text-emerald-400">No auth required</span>
            </div>

            <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200">
              <pre className="overflow-x-auto whitespace-pre-wrap break-all pr-12 text-blue-300">
                {activeCommand}
              </pre>
              <button
                onClick={copyToClipboard}
                className="absolute right-3 top-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors border border-slate-700"
                title="Copy command to clipboard"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium font-sans">
                    <CheckCheck className="w-4 h-4" />
                    Copied
                  </span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Feature highlights without any login */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-[11px]">Free Tier Included</div>
              <div className="text-sm font-bold text-white mt-0.5">500,000 events/mo</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-[11px]">CPU Overhead</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">&lt; 0.05% via eBPF</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-[11px]">Encryption</div>
              <div className="text-sm font-bold text-blue-400 mt-0.5">Strict mTLS 1.3</div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct Actions */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Want to test before installing on your nodes?
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDemo();
              }}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              Launch Live Console Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
