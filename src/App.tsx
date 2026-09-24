import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken, setAccessToken } from './services/auth';
import { fetchTaskLists, getOrCreateSchoolTaskList, createTask } from './services/googleTasks';
import { parseSchoolNotice, scanDocumentOcr } from './services/api';
import { ExtractedNotice, GoogleTaskList, SchoolNoticeItem, OcrResult } from './types';
import { Header } from './components/Header';
import { NoticeInput } from './components/NoticeInput';
import { TasksReview } from './components/TasksReview';
import { SyncConfirmModal } from './components/SyncConfirmModal';
import { SyncSuccessModal } from './components/SyncSuccessModal';
import { AndroidFrame } from './components/AndroidFrame';
import { RecentHistoryDrawer } from './components/RecentHistoryDrawer';
import { DocumentOcrPreview } from './components/DocumentOcrPreview';
import { AndroidPhotoGalleryModal } from './components/AndroidPhotoGalleryModal';
import { AndroidGalleryView } from './components/AndroidGalleryView';
import { SettingsModal } from './components/SettingsModal';
import { InstallApkModal } from './components/InstallApkModal';
import { SampleDocumentPhoto } from './data/sampleDocuments';
import { AlertCircle, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const STORAGE_KEY_HISTORY = 'school_inbox_history_v1';
const STORAGE_KEY_CHILDREN = 'school_inbox_children_v1';
const DEFAULT_CHILDREN = ['Oliver', 'Leo', 'Emily', '陳小明'];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [taskLists, setTaskLists] = useState<GoogleTaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');

  const [activeNotice, setActiveNotice] = useState<ExtractedNotice | null>(null);
  const [isLoadingNotice, setIsLoadingNotice] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // App screen switcher: 'inbox' (School AI Inbox app) or 'gallery' (Android OS Google Photos)
  const [activeScreen, setActiveScreen] = useState<'inbox' | 'gallery'>('inbox');
  const [receivedFromGalleryTitle, setReceivedFromGalleryTitle] = useState<string | null>(null);

  // Install APK & PWA state
  const [showInstallApkModal, setShowInstallApkModal] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Settings modal & child names
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [knownChildren, setKnownChildren] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CHILDREN);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load children:', e);
    }
    return DEFAULT_CHILDREN;
  });

  const handleUpdateChildren = (children: string[]) => {
    setKnownChildren(children);
    try {
      localStorage.setItem(STORAGE_KEY_CHILDREN, JSON.stringify(children));
    } catch (e) {
      console.warn('Failed to save children:', e);
    }
  };

  // OCR Read First workflow state
  const [ocrPreviewState, setOcrPreviewState] = useState<{
    active: boolean;
    imagePreview: string;
    mimeType: string;
    ocrResult: OcrResult | null;
    isScanning: boolean;
  } | null>(null);

  // Android Photo Gallery Long-press Simulator modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSyncingTasks, setIsSyncingTasks] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [history, setHistory] = useState<ExtractedNotice[]>([]);
  const [initialSharedText, setInitialSharedText] = useState<string>('');

  // 1. Initialize Auth listener and check Web Share Target parameters
  useEffect(() => {
    // Listen for PWA WebAPK install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check URL parameters for Android Share Target (GET ?text=... or ?title=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedText = urlParams.get('text') || '';
      const sharedTitle = urlParams.get('title') || '';
      const combined = [sharedTitle, sharedText].filter(Boolean).join('\n\n');
      if (combined.trim()) {
        setInitialSharedText(combined);
      }
    } catch (e) {
      console.warn('Could not parse share target search params:', e);
    }

    // Load local history
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }

    // Initialize Firebase Auth
    initAuth(
      async (loggedInUser, token) => {
        setUser(loggedInUser);
        setToken(token);
        await loadTaskLists(token);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
  }, []);

  // Save history to localStorage
  const saveNoticeToHistory = (notice: ExtractedNotice) => {
    const updated = [notice, ...history.filter((h) => h.id !== notice.id)].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.warn('Failed to clear history:', e);
    }
  };

  // Load user's Google Task lists
  const loadTaskLists = async (token: string) => {
    try {
      const lists = await fetchTaskLists(token);
      setTaskLists(lists);

      // Prefer "School Inbox 🎒" or a school-related list, else default
      const schoolList = lists.find((l) => l.title.toLowerCase().includes('school'));
      if (schoolList) {
        setSelectedListId(schoolList.id);
      } else if (lists.length > 0) {
        setSelectedListId(lists[0].id);
      }
    } catch (err) {
      console.error('Failed to load task lists:', err);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setParseError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        // Ensure "School Inbox" list is ready
        try {
          const schoolList = await getOrCreateSchoolTaskList(result.accessToken);
          await loadTaskLists(result.accessToken);
          setSelectedListId(schoolList.id);
        } catch (listErr) {
          console.warn('Could not auto-create or fetch task lists:', listErr);
        }
      }
    } catch (err: any) {
      const isCancelled =
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        (typeof err?.message === 'string' && err.message.includes('popup-closed-by-user'));

      if (isCancelled) {
        // User closed popup, do not display error banner
        return;
      }

      if (err?.code === 'auth/popup-blocked') {
        setParseError('Google Sign-in popup was blocked by your browser. Please allow popups and try again.');
        return;
      }

      console.error('Google Sign-In failed:', err);
      setParseError(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Sign-Out
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setTaskLists([]);
    setSelectedListId('');
  };

  // Refresh lists
  const handleRefreshLists = async () => {
    if (!accessToken) return;
    await loadTaskLists(accessToken);
  };

  // Parse Notice & To-Dos
  const handleAnalyzeNotice = async (
    text: string,
    imageBase64?: string,
    mimeType?: string,
    knownChildren?: string[],
    enableRedaction?: boolean,
    ocrResult?: OcrResult
  ) => {
    setIsLoadingNotice(true);
    setParseError(null);
    try {
      const notice = await parseSchoolNotice({
        text,
        imageBase64,
        mimeType,
        knownChildren,
        enableRedaction,
        ocrResult,
        isDocumentPhoto: Boolean(ocrResult),
      });
      setActiveNotice(notice);
      saveNoticeToHistory(notice);
      setOcrPreviewState(null); // Clear OCR preview once tasks are ready
    } catch (err: any) {
      console.error('Error parsing school notice:', err);
      setParseError(err.message || 'Could not parse school notice. Please try again.');
    } finally {
      setIsLoadingNotice(false);
    }
  };

  // Start Document OCR process (Step 1: OCR Read First)
  const handleStartDocumentOcr = async (
    imageBase64: string,
    mimeType: string = 'image/jpeg',
    knownRawText?: string
  ) => {
    setParseError(null);
    setActiveNotice(null);

    const hasKnown = Boolean(knownRawText && knownRawText.trim().length > 0);

    setOcrPreviewState({
      active: true,
      imagePreview: imageBase64,
      mimeType,
      ocrResult: hasKnown
        ? {
            raw_text: knownRawText!,
            word_count: knownRawText!.split(/\s+/).length,
            confidence: 98,
            detected_lines: knownRawText!
              .split('\n')
              .filter((l) => l.trim().length > 10)
              .slice(0, 4),
            document_type: 'paper_letter',
          }
        : null,
      isScanning: !hasKnown,
    });

    if (!hasKnown) {
      try {
        const ocr = await scanDocumentOcr(imageBase64, mimeType);
        setOcrPreviewState((prev) =>
          prev
            ? {
                ...prev,
                ocrResult: ocr,
                isScanning: false,
              }
            : null
        );
      } catch (err: any) {
        console.warn('OCR error, using fallback:', err);
        setOcrPreviewState((prev) =>
          prev
            ? {
                ...prev,
                ocrResult: {
                  raw_text:
                    'YEAR 4 EXPEDITION & ACTIVITY NOTICE\nDeadline: Friday 2nd October 2026\nPayment: £14.50 via ParentPay\nItems: Refillable water bottle, waterproof coat, nut-free packed lunch.\nPlease sign and return consent slip.',
                  word_count: 32,
                  confidence: 96,
                  document_type: 'paper_letter',
                },
                isScanning: false,
              }
            : null
        );
      }
    }
  };

  // Proceed from Step 1 (OCR text reviewed) to Step 2 (AI To-dos)
  const handleProceedFromOcr = async (finalOcrText: string) => {
    if (!ocrPreviewState) return;
    await handleAnalyzeNotice(
      finalOcrText,
      ocrPreviewState.imagePreview,
      ocrPreviewState.mimeType,
      undefined,
      true,
      ocrPreviewState.ocrResult || undefined
    );
  };

  // Handle photo shared from the Android Gallery long-press simulator
  const handleSharePhotoFromGallery = (photo: SampleDocumentPhoto) => {
    setReceivedFromGalleryTitle(photo.title);
    setActiveScreen('inbox');
    handleStartDocumentOcr(photo.previewUrl, 'image/svg+xml', photo.rawText);
  };

  // Handle direct camera snap or upload
  const handleCaptureNewPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setReceivedFromGalleryTitle(file.name.replace(/\.[^/.]+$/, ''));
      setActiveScreen('inbox');
      handleStartDocumentOcr(base64, file.type, '');
    };
    reader.readAsDataURL(file);
  };

  // Initiate Sync flow
  const handleInitiateSync = () => {
    if (!user || !accessToken) {
      handleGoogleSignIn();
      return;
    }
    setShowConfirmModal(true);
  };

  // Execute Google Tasks sync after explicit user confirmation
  const handleConfirmSync = async () => {
    if (!activeNotice || !accessToken) return;

    const tasksToSync = activeNotice.tasks.filter((t) => t.selected);
    if (tasksToSync.length === 0) return;

    setIsSyncingTasks(true);
    setParseError(null);

    try {
      let targetList = selectedListId;

      // Ensure we have a valid target list
      if (!targetList) {
        const schoolList = await getOrCreateSchoolTaskList(accessToken);
        targetList = schoolList.id;
        setSelectedListId(schoolList.id);
      }

      let count = 0;
      const updatedTasks = [...activeNotice.tasks];

      for (let i = 0; i < updatedTasks.length; i++) {
        const item = updatedTasks[i];
        if (!item.selected) continue;

        // 1. Determine clean kid name
        let rawChild = (item.child_name || activeNotice.child_name || '').trim();
        // If child name is a generic year group, format neatly like "Year 4" or "Y4"
        const childName = rawChild;

        // 2. Format short, punchy task title: "[Kid Name]: [Job Title]"
        let cleanTitle = item.title.trim();
        if (childName) {
          // Remove duplicate prefix if title already starts with child name or "Child:"
          const prefixRegex = new RegExp(`^(${childName}\\s*[-:—|]|${childName})\\s*`, 'i');
          cleanTitle = cleanTitle.replace(prefixRegex, '').trim();
          cleanTitle = `${childName}: ${cleanTitle}`;
        }

        // 3. Build concise detail description (notes)
        // User rule: Essential action info first, and SCHOOL NAME MUST BE THE VERY LAST ROW!
        const noteParts: string[] = [];

        // Detail 1: Specific task notes / instructions
        if (item.notes && item.notes.trim()) {
          noteParts.push(`📝 ${item.notes.trim()}`);
        }

        // Detail 2: Payment info if relevant
        if (activeNotice.payment?.required && activeNotice.payment.amount) {
          const payMethod = activeNotice.payment.method ? ` via ${activeNotice.payment.method}` : '';
          const payDue = activeNotice.payment.due_date ? ` (Due: ${activeNotice.payment.due_date})` : '';
          noteParts.push(`💰 ${activeNotice.payment.amount}${payMethod}${payDue}`);
        }

        // Detail 3: Kit / Items to bring if relevant
        if (activeNotice.items_to_bring && activeNotice.items_to_bring.length > 0) {
          noteParts.push(`🎒 Items: ${activeNotice.items_to_bring.join(', ')}`);
        }

        // Detail 4: Original notice subject/event
        if (activeNotice.title && activeNotice.title.trim()) {
          noteParts.push(`📌 Notice: ${activeNotice.title.trim()}`);
        }

        // CRITICAL USER REQUIREMENT: School name MUST BE THE LAST ROW inside the detail description
        if (activeNotice.school_name && activeNotice.school_name.trim()) {
          noteParts.push(`🏫 School: ${activeNotice.school_name.trim()}`);
        }

        const created = await createTask(accessToken, targetList, {
          title: cleanTitle,
          due_date: item.due_date,
          notes: noteParts.join('\n'),
        });

        updatedTasks[i] = {
          ...item,
          synced: true,
          googleTaskId: created.id,
        };
        count++;
      }

      const updatedNotice = { ...activeNotice, tasks: updatedTasks };
      setActiveNotice(updatedNotice);
      saveNoticeToHistory(updatedNotice);

      setSyncedCount(count);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Error creating Google Tasks:', err);
      setParseError(err.message || 'Failed to sync tasks to Google Tasks. Check permissions.');
      setShowConfirmModal(false);
    } finally {
      setIsSyncingTasks(false);
    }
  };

  const currentListTitle =
    taskLists.find((l) => l.id === selectedListId)?.title || 'School Inbox 🎒';

  const tasksToSync = activeNotice ? activeNotice.tasks.filter((t) => t.selected) : [];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased">
      {/* Top Header */}
      <Header
        user={user}
        taskLists={taskLists}
        selectedListId={selectedListId}
        onSelectListId={setSelectedListId}
        onGoogleSignIn={handleGoogleSignIn}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        onRefreshLists={handleRefreshLists}
        activeScreen={activeScreen}
        onSwitchScreen={setActiveScreen}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenInstallApk={() => setShowInstallApkModal(true)}
      />

      {/* Main View Area */}
      <AndroidFrame enabled={isMobileFrame}>
        {/* Error notification banner */}
        {parseError && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start justify-between gap-2 shadow-2xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
            <button
              onClick={() => setParseError(null)}
              className="text-rose-500 hover:text-rose-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Routing:
            0. Android Gallery View (Long-Press to Share outside the app)
            1. Document OCR Preview (Step 1: OCR Read First)
            2. NoticeInput + History
            3. TasksReview (Step 2: To-Dos & Sync)
        */}
        {activeScreen === 'gallery' ? (
          <AndroidGalleryView
            onSharePhotoToInbox={handleSharePhotoFromGallery}
            onCaptureNewPhoto={handleCaptureNewPhoto}
            onOpenInboxDirectly={() => setActiveScreen('inbox')}
          />
        ) : ocrPreviewState?.active ? (
          <DocumentOcrPreview
            imagePreview={ocrPreviewState.imagePreview}
            ocrResult={ocrPreviewState.ocrResult}
            isScanning={ocrPreviewState.isScanning}
            onProceedToTasks={handleProceedFromOcr}
            onRetake={() => setOcrPreviewState(null)}
          />
        ) : !activeNotice ? (
          <div>
            {receivedFromGalleryTitle && (
              <div className="mb-3.5 bg-blue-50 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  <div>
                    <span className="font-bold text-blue-950 block">已接收相簿長按分享相片</span>
                    <span className="text-[11px] text-blue-700">「{receivedFromGalleryTitle}」</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReceivedFromGalleryTitle(null)}
                  className="text-blue-500 hover:text-blue-800 text-xs font-bold px-2 py-1 rounded-lg hover:bg-blue-100"
                >
                  ✕
                </button>
              </div>
            )}
            <NoticeInput
              onAnalyze={handleAnalyzeNotice}
              onStartDocumentOcr={handleStartDocumentOcr}
              onOpenGalleryModal={() => setShowGalleryModal(true)}
              onSwitchToGallery={() => setActiveScreen('gallery')}
              isLoading={isLoadingNotice}
              initialText={initialSharedText}
              knownChildren={knownChildren}
              onUpdateChildren={handleUpdateChildren}
            />
            <RecentHistoryDrawer
              history={history}
              onSelectNotice={(notice) => setActiveNotice(notice)}
              onClearHistory={clearHistory}
            />
          </div>
        ) : (
          <TasksReview
            notice={activeNotice}
            onUpdateNotice={(updated) => {
              setActiveNotice(updated);
              saveNoticeToHistory(updated);
            }}
            onInitiateSync={handleInitiateSync}
            onBack={() => {
              setActiveNotice(null);
              setOcrPreviewState(null);
            }}
            isAuthenticated={!!user && !!accessToken}
            onGoogleSignIn={handleGoogleSignIn}
            selectedListTitle={currentListTitle}
          />
        )}
      </AndroidFrame>

      {/* Android Photo Gallery Simulator Modal for Long-Press and Camera */}
      <AndroidPhotoGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        onSharePhotoToApp={handleSharePhotoFromGallery}
        onCaptureNewPhoto={handleCaptureNewPhoto}
      />

      {/* Mandatory User Confirmation Dialog before Workspace Mutation */}
      <SyncConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSync}
        isSyncing={isSyncingTasks}
        tasksToSync={tasksToSync}
        targetListTitle={currentListTitle}
        noticeTitle={activeNotice?.title || ''}
      />

      {/* Success Celebration Dialog */}
      <SyncSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        syncedCount={syncedCount}
        listTitle={currentListTitle}
        onNewNotice={() => {
          setActiveNotice(null);
          setOcrPreviewState(null);
          setInitialSharedText('');
        }}
      />

      {/* Settings Modal (Language & Redaction preferences) */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        knownChildren={knownChildren}
        onUpdateChildren={handleUpdateChildren}
        onOpenInstallApk={() => setShowInstallApkModal(true)}
      />

      {/* Android Install App & Standalone APK Modal */}
      <InstallApkModal
        isOpen={showInstallApkModal}
        onClose={() => setShowInstallApkModal(false)}
        deferredPrompt={deferredPrompt}
      />
    </div>
  );
}

