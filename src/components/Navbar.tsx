import { useState } from 'react';
import { Menu, X, ArrowRight, Play, User as UserIcon, LogOut } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
  onSignIn: () => void;
  user?: User | null;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
}

export function Navbar({ 
  onGetStarted, 
  onViewDemo, 
  onSignIn, 
  user, 
  onGoToDashboard, 
  onLogout 
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="tracking-tight text-white text-xl font-extrabold">BlueKon</span>
        </a>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Capabilities
          </a>
          <a href="#architecture" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Architecture
          </a>
          <a href="#case-study" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Customers
          </a>
          <a href="#pricing" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Pricing
          </a>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onViewDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            View Demo
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onSignIn}
                className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                Get Started Free
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Features
            </a>
            <a 
              href="#capabilities" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Capabilities
            </a>
            <a 
              href="#architecture" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Architecture
            </a>
            <a 
              href="#case-study" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Customers
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onViewDemo();
              }}
              className="w-full py-2.5 px-4 text-xs font-medium text-center text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              View Demo
            </button>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToDashboard && onGoToDashboard();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2 px-4 text-xs font-medium text-center text-rose-400 hover:text-rose-300 bg-slate-900 rounded-lg flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignIn();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-medium text-center text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGetStarted();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
