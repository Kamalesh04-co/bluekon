import { useState, useEffect } from 'react';
import { 
  FolderPlus, FilePlus, Folder, File, Trash2, Calendar, 
  HardDrive, AlertCircle, Loader2, X, Filter, ChevronRight
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, addDoc, 
  deleteDoc, doc, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestoreErrors';

interface MyFilesSectionProps {
  userId: string;
  searchQuery?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  createdAt: any;
}

export interface FileItem {
  id: string;
  name: string;
  folderId?: string | null;
  size: string;
  createdAt: any;
}

export function MyFilesSection({ userId, searchQuery = '' }: MyFilesSectionProps) {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all');

  // Modals state (no browser prompts)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [targetFolderId, setTargetFolderId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirmation modal state
  const [itemToDelete, setItemToDelete] = useState<{ type: 'folder' | 'file'; id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Subscribe to user folders
  useEffect(() => {
    if (!userId) return;
    setLoadingFolders(true);
    const foldersPath = `users/${userId}/folders`;
    const q = query(collection(db, 'users', userId, 'folders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: FolderItem[] = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...(doc.data() as any) });
        });
        setFolders(fetched);
        setLoadingFolders(false);
      },
      (error) => {
        setLoadingFolders(false);
        handleFirestoreError(error, OperationType.LIST, foldersPath);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Subscribe to user files
  useEffect(() => {
    if (!userId) return;
    setLoadingFiles(true);
    const filesPath = `users/${userId}/files`;
    const q = query(collection(db, 'users', userId, 'files'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: FileItem[] = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...(doc.data() as any) });
        });
        setFiles(fetched);
        setLoadingFiles(false);
      },
      (error) => {
        setLoadingFiles(false);
        handleFirestoreError(error, OperationType.LIST, filesPath);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setFormError('Please enter a folder name.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    try {
      await addDoc(collection(db, 'users', userId, 'folders'), {
        name: folderName.trim(),
        createdAt: serverTimestamp(),
      });
      setFolderName('');
      setIsFolderModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create folder.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      setFormError('Please enter a file name.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    try {
      await addDoc(collection(db, 'users', userId, 'files'), {
        name: fileName.trim(),
        folderId: targetFolderId ? targetFolderId : null,
        size: fileSize.trim() || '512 KB',
        createdAt: serverTimestamp(),
      });
      setFileName('');
      setTargetFolderId('');
      setFileSize('1.2 MB');
      setIsFileModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add file.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      if (itemToDelete.type === 'folder') {
        await deleteDoc(doc(db, 'users', userId, 'folders', itemToDelete.id));
        if (selectedFolderId === itemToDelete.id) {
          setSelectedFolderId('all');
        }
      } else {
        await deleteDoc(doc(db, 'users', userId, 'files', itemToDelete.id));
      }
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Delete error', err);
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

  const getFolderName = (fId?: string | null) => {
    if (!fId) return 'Root / General';
    const match = folders.find(f => f.id === fId);
    return match ? match.name : 'Unknown folder';
  };

  const filteredFolders = q
    ? folders.filter(folder => folder.name.toLowerCase().includes(q))
    : folders;

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolderId === 'all' || f.folderId === selectedFolderId;
    if (!matchesFolder) return false;
    if (!q) return true;
    const nameMatch = f.name.toLowerCase().includes(q);
    const folderMatch = getFolderName(f.folderId).toLowerCase().includes(q);
    const sizeMatch = f.size.toLowerCase().includes(q);
    return nameMatch || folderMatch || sizeMatch;
  });

  const isLoading = loadingFolders || loadingFiles;

  return (
    <div className="space-y-6">
      {/* Search active indicator */}
      {q && (
        <div className="flex items-center justify-between p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Searching for <strong className="text-white">"{searchQuery}"</strong> — showing {filteredFiles.length} file{filteredFiles.length === 1 ? '' : 's'} and {filteredFolders.length} folder{filteredFolders.length === 1 ? '' : 's'}.
            </span>
          </div>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-400" />
            My Files &amp; Storage
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your configuration archives, deployment scripts, and architecture assets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFolderName('');
              setFormError('');
              setIsFolderModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors whitespace-nowrap"
          >
            <FolderPlus className="w-4 h-4 text-blue-400" />
            New Folder
          </button>
          <button
            onClick={() => {
              setFileName('');
              setFormError('');
              setTargetFolderId(selectedFolderId !== 'all' ? selectedFolderId : '');
              setIsFileModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            <FilePlus className="w-4 h-4" />
            Add File
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto" />
          <p className="text-xs text-slate-400 mt-3 font-mono">Synchronizing files from Firestore...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Folders Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" />
                Folders ({filteredFolders.length})
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedFolderId('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedFolderId === 'all'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Files
                </button>
              </div>
            </div>

            {filteredFolders.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl">
                <Folder className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 mt-2">
                  {q ? `No folders match "${searchQuery}"` : 'No folders created yet.'}
                </p>
                {!q && (
                  <button
                    onClick={() => {
                      setFolderName('');
                      setFormError('');
                      setIsFolderModalOpen(true);
                    }}
                    className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
                  >
                    Create your first folder
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredFolders.map((folder) => {
                  const isSelected = selectedFolderId === folder.id;
                  const folderFilesCount = files.filter(f => f.folderId === folder.id).length;
                  return (
                    <div
                      key={folder.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                      onClick={() => setSelectedFolderId(isSelected ? 'all' : folder.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                          <Folder className="w-4 h-4 fill-amber-400/20" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete({ type: 'folder', id: folder.id, name: folder.name });
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800/80 rounded transition-colors"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs font-semibold text-white truncate">{folder.name}</div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{folderFilesCount} files</span>
                          <span>{formatDate(folder.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Files List Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <File className="w-4 h-4 text-blue-400" />
                Files ({filteredFiles.length})
                {selectedFolderId !== 'all' && (
                  <span className="text-xs font-mono text-blue-400">
                    in /{getFolderName(selectedFolderId)}
                  </span>
                )}
              </div>

              {selectedFolderId !== 'all' && (
                <button
                  onClick={() => setSelectedFolderId('all')}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-4 font-mono"
                >
                  Show all files
                </button>
              )}
            </div>

            {filteredFiles.length === 0 ? (
              <div className="p-10 text-center border border-dashed border-slate-800 rounded-xl">
                <File className="w-8 h-8 text-slate-600 mx-auto" />
                {q ? (
                  <>
                    <p className="text-xs text-slate-300 font-medium mt-2">No matching files found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      No files match your search for <span className="text-blue-400 font-mono">"{searchQuery}"</span>.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-300 font-medium mt-2">No files uploaded yet.</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Add manifests, telemetry snapshots, or configuration specs.</p>
                    <button
                      onClick={() => {
                        setFileName('');
                        setFormError('');
                        setTargetFolderId(selectedFolderId !== 'all' ? selectedFolderId : '');
                        setIsFileModalOpen(true);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      Add First File
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">File Name</th>
                      <th className="py-2.5 px-3">Folder</th>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Date Added</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-3 px-3 font-semibold text-white flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <File className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-[240px]">{file.name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {getFolderName(file.folderId)}
                        </td>
                        <td className="py-3 px-3 text-slate-400">{file.size}</td>
                        <td className="py-3 px-3 text-slate-400">{formatDate(file.createdAt)}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setItemToDelete({ type: 'file', id: file.id, name: file.name })}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Folder Modal (Clean in-app modal, NO window.prompt) */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-400" />
                Create New Folder
              </h3>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Production Manifests"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
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
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add File Modal (Clean in-app modal, NO window.prompt) */}
      {isFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FilePlus className="w-4 h-4 text-blue-400" />
                Add New File Metadata
              </h3>
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFile} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  File Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. k8s-mesh-deployment.yaml"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Folder (Optional)
                </label>
                <select
                  value={targetFolderId}
                  onChange={(e) => setTargetFolderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                >
                  <option value="">Root / General (No folder)</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  File Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['240 KB', '1.2 MB', '4.8 MB'].map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFileSize(sz)}
                      className={`py-1.5 px-2 text-xs font-mono rounded-lg border transition-colors ${
                        fileSize === sz
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="Or enter custom size (e.g. 512 KB)"
                  className="mt-2 w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFileModalOpen(false)}
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
                  Save File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Delete Confirmation Modal (NO window.confirm) */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-semibold text-white">
              Delete {itemToDelete.type === 'folder' ? 'Folder' : 'File'}?
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              Are you sure you want to delete <span className="font-semibold text-white">"{itemToDelete.name}"</span>? This action removes this record from your Firestore account.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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
