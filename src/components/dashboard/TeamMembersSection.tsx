import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Trash2, Calendar, Shield, AlertCircle, Loader2, X, Check, Filter
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  deleteDoc, doc, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestoreErrors';

interface TeamMembersSectionProps {
  userId: string;
  searchQuery?: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  role?: string;
  createdAt: any;
}

export function TeamMembersSection({ userId, searchQuery = '' }: TeamMembersSectionProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // In-app modal state (no browser prompts)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Site Reliability Engineer');
  const [customRole, setCustomRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [memberToDelete, setMemberToDelete] = useState<TeamMemberItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Subscribe to user's team members
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const membersPath = `users/${userId}/teamMembers`;
    const q = query(collection(db, 'users', userId, 'teamMembers'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: TeamMemberItem[] = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...(doc.data() as any) });
        });
        setMembers(fetched);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, membersPath);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter the team member name.');
      return;
    }
    const finalRole = role === 'Other' ? (customRole.trim() || 'Collaborator') : role;
    setSubmitting(true);
    setFormError('');

    try {
      await addDoc(collection(db, 'users', userId, 'teamMembers'), {
        name: name.trim(),
        role: finalRole,
        createdAt: serverTimestamp(),
      });
      setName('');
      setCustomRole('');
      setRole('Site Reliability Engineer');
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add team member.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', userId, 'teamMembers', memberToDelete.id));
      setMemberToDelete(null);
    } catch (err) {
      console.error('Delete member error', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (val: any) => {
    if (!val) return 'Just now';
    if (val instanceof Timestamp || val.toDate) {
      return val.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (typeof val === 'string') return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return 'Recent';
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'TM';
  };

  const roleColors: Record<string, string> = {
    'Platform Lead': 'bg-purple-950/60 text-purple-300 border-purple-800/40',
    'Site Reliability Engineer': 'bg-blue-950/60 text-blue-300 border-blue-800/40',
    'DevOps Engineer': 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
    'Security Architect': 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    'Backend Engineer': 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40',
  };

  const q = searchQuery.toLowerCase().trim();

  const filteredMembers = q
    ? members.filter(m =>
        m.name.toLowerCase().includes(q) ||
        (m.role && m.role.toLowerCase().includes(q))
      )
    : members;

  return (
    <div className="space-y-6">
      {/* Search active indicator */}
      {q && (
        <div className="flex items-center justify-between p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Searching team members for <strong className="text-white">"{searchQuery}"</strong> — showing {filteredMembers.length} of {members.length} member{members.length === 1 ? '' : 's'}.
            </span>
          </div>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Team Members
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage infrastructure access, platform roles, and incident responder assignments.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setCustomRole('');
            setFormError('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
          <p className="text-xs text-slate-400 mt-3 font-mono">Loading team members from Firestore...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white mt-3">No team members added yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Assign engineers, DevOps responders, or security auditors to your BlueKon cluster workspace.
          </p>
          <button
            onClick={() => {
              setName('');
              setCustomRole('');
              setFormError('');
              setIsModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add First Member
          </button>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white mt-3">No matching team members found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No team members match your search for <span className="text-blue-400 font-mono">"{searchQuery}"</span>. Try searching by another name or role.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              Active Team Roster ({filteredMembers.length})
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Role-Based Access Guardrails Enforced
            </span>
          </div>

          <div className="divide-y divide-slate-800/70">
            {filteredMembers.map((member) => {
              const badgeClass = roleColors[member.role || ''] || 'bg-slate-800 text-slate-300 border-slate-700';
              return (
                <div
                  key={member.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs tracking-wider shrink-0 shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white tracking-tight truncate">
                        {member.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-mono text-[11px]">
                          Joined {formatDate(member.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${badgeClass}`}>
                      {member.role || 'Member'}
                    </span>
                    <button
                      onClick={() => setMemberToDelete(member)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Member In-App Modal (NO browser prompt) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Add Team Member
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Vance"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Platform Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                >
                  <option value="Platform Lead">Platform Lead</option>
                  <option value="Site Reliability Engineer">Site Reliability Engineer (SRE)</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Security Architect">Security Architect</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Infrastructure Observer">Infrastructure Observer</option>
                  <option value="Other">Other Custom Role...</option>
                </select>

                {role === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Enter custom role title"
                    className="mt-2 w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Member In-App Modal (NO window.confirm) */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-semibold text-white">
              Remove Team Member?
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Are you sure you want to remove <span className="font-semibold text-white">"{memberToDelete.name}"</span> from your team? They will lose access to this cluster space.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
