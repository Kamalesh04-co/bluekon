/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MetricsStrip } from './components/MetricsStrip';
import { CapabilitiesBento } from './components/CapabilitiesBento';
import { WorkflowSection } from './components/WorkflowSection';
import { CaseStudySection } from './components/CaseStudySection';
import { PricingSection } from './components/PricingSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { InteractiveDemoModal } from './components/InteractiveDemoModal';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        // Only verified users are granted dashboard access
        setUser(currentUser);
        setCurrentView('dashboard');
      } else {
        setUser(null);
        setCurrentView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenDemo = () => {
    setIsAuthModalOpen(false);
    setIsDemoModalOpen(true);
  };

  const handleOpenSignUp = () => {
    if (user) {
      setCurrentView('dashboard');
      return;
    }
    setAuthMode('signup');
    setIsDemoModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleOpenSignIn = () => {
    if (user) {
      setCurrentView('dashboard');
      return;
    }
    setAuthMode('signin');
    setIsDemoModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleGoogleSignInDirect = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setUser(result.user);
        setCurrentView('dashboard');
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      setAuthMode('signin');
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('landing');
      // Return to auth screen as requested
      setAuthMode('signin');
      setIsAuthModalOpen(true);
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  // If authenticated and on dashboard view, render Dashboard
  if (user && currentView === 'dashboard') {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar with Brand & Primary Actions */}
      <Navbar 
        onGetStarted={handleOpenSignUp} 
        onSignIn={handleOpenSignIn}
        onViewDemo={handleOpenDemo}
        user={user}
        onGoToDashboard={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with 'Get Started Free', 'Continue with Google' & 'View Demo' */}
        <HeroSection 
          onGetStarted={handleOpenSignUp} 
          onViewDemo={handleOpenDemo} 
          onGoogleSignIn={handleGoogleSignInDirect}
        />

        {/* Quantified Proof & Metric Strip */}
        <MetricsStrip />

        {/* Core Capabilities Bento Grid */}
        <CapabilitiesBento 
          onViewDemo={handleOpenDemo} 
          onGetStarted={handleOpenSignUp} 
        />

        {/* Autonomous Architecture & Workflows */}
        <WorkflowSection 
          onViewDemo={handleOpenDemo} 
          onGetStarted={handleOpenSignUp} 
        />

        {/* Real-world Production Case Study */}
        <CaseStudySection 
          onGetStarted={handleOpenSignUp} 
          onViewDemo={handleOpenDemo} 
        />

        {/* Transparent Pricing Matrix */}
        <PricingSection 
          onGetStarted={handleOpenSignUp} 
          onViewDemo={handleOpenDemo} 
        />

        {/* Conversion Action Closer */}
        <CtaBanner 
          onGetStarted={handleOpenSignUp} 
          onViewDemo={handleOpenDemo} 
        />
      </main>

      {/* Quiet, Professional Footer */}
      <Footer 
        onGetStarted={handleOpenSignUp} 
        onViewDemo={handleOpenDemo} 
      />

      {/* Interactive Live Demo Sandbox Modal */}
      <InteractiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onGetStarted={handleOpenSignUp}
      />

      {/* Firebase Authentication Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
