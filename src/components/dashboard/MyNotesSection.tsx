import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Calendar, AlertCircle, Loader2, X, Eye, Filter 
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  deleteDoc, doc, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestoreErrors';

interface MyNotesSectionProps {
  userId: string;
  searchQuery?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content?: string;
  createdAt: any;
}

export function MyNotesSection({ userId, searchQuery = '' }: MyNotesSectionProps) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // In-app modal state (no browser prompts)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // View note detail modal
  const [viewingNote, setViewingNote] = useState<NoteItem | null>(null);

  // In-app delete modal state
  const [noteToDelete, setNoteToDelete] = useState<NoteItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Subscribe to user's notes
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const notesPath = `users/${userId}/notes`;
    const q = query(collection(db, 'users', userId, 'notes'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: NoteItem[] = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...(doc.data() as any) });
        });
        setNotes(fetched);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        handleFirestoreError(error, OperationType.LIST, notesPath);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a note title.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    try {
      await addDoc(collection(db, 'users', userId, 'notes'), {
        title: title.trim(),
        content: content.trim() || '',
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setContent('');
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save note.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', userId, 'notes', noteToDelete.id));
      if (viewingNote?.id === noteToDelete.id) {
        setViewingNote(null);
      }
      setNoteToDelete(null);
    } catch (err) {
      console.error('Delete note error', err);
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

  const q = searchQuery.toLowerCase().trim();

  const filteredNotes = q
    ? notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q))
      )
    : notes;

  return (
    <div className="space-y-6">
      {/* Search active indicator */}
      {q && (
        <div className="flex items-center justify-between p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Searching notes for <strong className="text-white">"{searchQuery}"</strong> — showing {filteredNotes.length} of {notes.length} note{notes.length === 1 ? '' : 's'}.
            </span>
          </div>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            My Notes
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Capture architecture blueprints, incident postmortems, and deployment runbooks.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setContent('');
            setFormError('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
          <p className="text-xs text-slate-400 mt-3 font-mono">Loading notes from Firestore...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white mt-3">No notes created yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first note to store credentials templates, system runbooks, or meeting memos.
          </p>
          <button
            onClick={() => {
              setTitle('');
              setContent('');
              setFormError('');
              setIsModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Create First Note
          </button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white mt-3">No matching notes found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No notes match your search for <span className="text-blue-400 font-mono">"{searchQuery}"</span>. Try a different keyword or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setViewingNote(note)}
                      className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                      title="View full note"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setNoteToDelete(note)}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {note.content || <span className="text-slate-500 italic">No content provided</span>}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {formatDate(note.createdAt)}
                </span>
                <button
                  onClick={() => setViewingNote(note)}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-sans text-xs"
                >
                  Read &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Note In-App Modal (NO browser prompt) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Create New Note
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cluster Ingress Migration Checklist"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Content (Optional)
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note markdown or instructions here..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none leading-relaxed"
                />
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-semibold text-white truncate max-w-xs sm:max-w-md">
                  {viewingNote.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingNote(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Created on {formatDate(viewingNote.createdAt)}
              </div>

              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800">
                {viewingNote.content || <span className="text-slate-500 italic">No note content provided.</span>}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const toDel = viewingNote;
                  setViewingNote(null);
                  setNoteToDelete(toDel);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Note
              </button>
              <button
                onClick={() => setViewingNote(null)}
                className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (NO window.confirm) */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-semibold text-white">
              Delete Note?
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Are you sure you want to delete <span className="font-semibold text-white">"{noteToDelete.title}"</span>? This will permanently remove it from your notes collection.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNote}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
