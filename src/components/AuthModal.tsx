import { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'signin' | 'signup' | 'verification';
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verification'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<string>('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setResendStatus('');
  }, [initialMode, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        // Sign In with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        
        // If user's email is not verified, block access, sign out, and show verification screen
        if (!userCredential.user.emailVerified) {
          try {
            await sendEmailVerification(userCredential.user);
          } catch {
            // Ignored if sent recently
          }
          await signOut(auth);
          setVerificationEmail(email.trim());
          setMode('verification');
          setLoading(false);
          return;
        }

        // Email verified: proceed to dashboard
        setEmail('');
        setPassword('');
        onSuccess();
      } else {
        // Sign Up with Firebase Auth: Do NOT sign in automatically
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        
        // Send verification email
        await sendEmailVerification(userCredential.user);
        
        // Immediately sign out to prevent automatic sign in
        await signOut(auth);
        
        // Show verification screen
        setVerificationEmail(email.trim());
        setMode('verification');
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (mode === 'signin') {
        // Required exact text: "Email or password is incorrect"
        if (
          code === 'auth/invalid-credential' || 
          code === 'auth/wrong-password' || 
          code === 'auth/user-not-found' ||
          code === 'auth/invalid-email'
        ) {
          setErrorMessage('Email or password is incorrect');
        } else {
          setErrorMessage('Email or password is incorrect');
        }
      } else {
        // Sign Up errors
        // Required exact text: "User already exists. Please sign in"
        if (code === 'auth/email-already-in-use') {
          setErrorMessage('User already exists. Please sign in');
        } else if (code === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters');
        } else if (code === 'auth/invalid-email') {
          setErrorMessage('Please enter a valid email address');
        } else {
          setErrorMessage(err.message || 'Failed to sign up. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      // Google sign-in accounts are verified by Google
      if (result.user) {
        onSuccess();
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }
      if (code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by your browser. Please allow popups for this site to sign in with Google.');
        return;
      }
      if (code === 'auth/unauthorized-domain') {
        setErrorMessage('This app domain is not yet authorized in Firebase Console under Authentication -> Settings -> Authorized Domains.');
        return;
      }
      setErrorMessage(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setMode('signin');
    setErrorMessage('');
    setResendStatus('');
    if (verificationEmail) {
      setEmail(verificationEmail);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm tracking-wider">
              BK
            </div>
            <div>
              <h3 id="auth-modal-title" className="text-base font-semibold text-white">
                {mode === 'verification'
                  ? 'Verify Your Email'
                  : mode === 'signin'
                  ? 'Sign In to BlueKon'
                  : 'Create BlueKon Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'verification'
                  ? 'Email verification required before accessing dashboard'
                  : mode === 'signin'
                  ? 'Welcome back! Sign in to access your cloud console.'
                  : 'Get instant access to your cloud dashboard.'}
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

        {/* Verification Screen */}
        {mode === 'verification' ? (
          <div className="p-6 space-y-5">
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
                <Mail className="w-7 h-7" />
              </div>

              {/* Required Exact Message */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 leading-relaxed max-w-sm">
                We have sent you a verification email to{' '}
                <span className="font-semibold text-blue-400 break-all">
                  {verificationEmail || email}
                </span>
                . Please verify it and log in.
              </div>
            </div>

            {resendStatus && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resendStatus}</span>
              </div>
            )}

            {/* Required Login Button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleGoToLogin}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex items-center justify-center pt-2">
                <div className="w-full border-t border-slate-800" />
                <span className="bg-slate-900 px-3 text-[11px] font-mono text-slate-500 uppercase">
                  or
                </span>
              </div>

              {/* Continue with Google button on verification screen */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-xl text-sm transition-colors border border-slate-700/80 flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-400">
              Already verified your email? Click{' '}
              <button
                type="button"
                onClick={handleGoToLogin}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-4 font-medium"
              >
                Login
              </button>{' '}
              to sign in.
            </div>
          </div>
        ) : (
          <>
            {/* Mode Selector Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                  mode === 'signin'
                    ? 'border-blue-500 text-white font-semibold bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                  mode === 'signup'
                    ? 'border-blue-500 text-white font-semibold bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Continue with Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium rounded-xl text-sm transition-colors border border-slate-700/80 flex items-center justify-center gap-3 shadow-sm hover:border-slate-600 disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span className="font-semibold text-slate-100">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-800" />
                <span className="bg-slate-900 px-3 text-[11px] font-mono text-slate-500 uppercase">
                  or continue with email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@company.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  {mode === 'signup' && (
                    <p className="text-[11px] text-slate-500 mt-1">Minimum 6 characters. A verification email will be sent.</p>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{mode === 'signin' ? 'Signing In...' : 'Sending Verification Email...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{mode === 'signin' ? 'Sign In with Email' : 'Register & Verify Email'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center pt-1 text-xs text-slate-400">
                {mode === 'signin' ? (
                  <span>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage('');
                      }}
                      className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
                    >
                      Sign Up
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage('');
                      }}
                      className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
