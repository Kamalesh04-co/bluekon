import { useState, useEffect } from 'react';
import { 
  LogOut, Server, Activity, UserCheck, 
  HardDrive, FileText, Users, Search, X 
} from 'lucide-react';
import { signOut, User } from 'firebase/auth';
import { 
  collection, doc, setDoc, getDoc, serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { MyFilesSection } from './dashboard/MyFilesSection';
import { MyNotesSection } from './dashboard/MyNotesSection';
import { TeamMembersSection } from './dashboard/TeamMembersSection';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'notes' | 'team'>('files');
  const [searchQuery, setSearchQuery] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Live item counts
  const [fileCount, setFileCount] = useState<number>(0);
  const [noteCount, setNoteCount] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);

  // Ensure user profile document exists under users/{uid}
  useEffect(() => {
    if (!user?.uid) return;
    const userDocRef = doc(db, 'users', user.uid);
    getDoc(userDocRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(userDocRef, {
          displayName: user.displayName || user.email?.split('@')[0] || 'Cloud Engineer',
          email: user.email || '',
          plan: 'Developer Free',
          createdAt: serverTimestamp(),
        }, { merge: true }).catch((err) => console.error('Failed to init user doc:', err));
      }
    }).catch((err) => console.error('User doc fetch error:', err));
  }, [user]);

  // Real-time count listeners for tab badges
  useEffect(() => {
    if (!user?.uid) return;
    const unsubFiles = onSnapshot(collection(db, 'users', user.uid, 'files'), (snap) => {
      setFileCount(snap.size);
    }, (err) => console.error('files count error', err));

    const unsubNotes = onSnapshot(collection(db, 'users', user.uid, 'notes'), (snap) => {
      setNoteCount(snap.size);
    }, (err) => console.error('notes count error', err));

    const unsubMembers = onSnapshot(collection(db, 'users', user.uid, 'teamMembers'), (snap) => {
      setMemberCount(snap.size);
    }, (err) => console.error('members count error', err));

    return () => {
      unsubFiles();
      unsubNotes();
      unsubMembers();
    };
  }, [user]);

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
              <span className="truncate max-w-[200px]">{user.email || 'Authenticated User'}</span>
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

        {/* Dashboard Navigation Tabs & Real-Time Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 py-2.5">
          {/* Navigation Tabs (My Files, My Notes, Team Members) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'files'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>My Files</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === 'files' ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {fileCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Notes</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === 'notes' ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {noteCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'team'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Members</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === 'team' ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {memberCount}
              </span>
            </button>
          </div>

          {/* Real-Time Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'files'
                  ? 'Search files and folders...'
                  : activeTab === 'notes'
                  ? 'Search notes by title or text...'
                  : 'Search team by name or role...'
              }
              className="w-full pl-8 pr-8 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1) My Files Section */}
        {activeTab === 'files' && (
          <div className="animate-fadeIn">
            <MyFilesSection userId={user.uid} searchQuery={searchQuery} />
          </div>
        )}

        {/* 2) My Notes Section */}
        {activeTab === 'notes' && (
          <div className="animate-fadeIn">
            <MyNotesSection userId={user.uid} searchQuery={searchQuery} />
          </div>
        )}

        {/* 3) Team Members Section */}
        {activeTab === 'team' && (
          <div className="animate-fadeIn">
            <TeamMembersSection userId={user.uid} searchQuery={searchQuery} />
          </div>
        )}

        {/* Quick Help & Session Note */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Authenticated with Firebase Auth as <span className="text-slate-200 font-mono">{user.email}</span>. Data is stored securely in Firestore under <span className="font-mono text-blue-400">users/{user.uid}</span>.
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
