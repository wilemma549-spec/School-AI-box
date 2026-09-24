import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Share2,
  Sparkles,
  Check,
  Search,
  MoreVertical,
  SlidersHorizontal,
  ArrowRight,
  Scan,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Info,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { SAMPLE_DOCUMENT_PHOTOS, SampleDocumentPhoto } from '../data/sampleDocuments';
import { useTranslation } from '../i18n/LanguageContext';

interface AndroidGalleryViewProps {
  onSharePhotoToInbox: (photo: SampleDocumentPhoto) => void;
  onCaptureNewPhoto: (file: File) => void;
  onOpenInboxDirectly: () => void;
}

export const AndroidGalleryView: React.FC<AndroidGalleryViewProps> = ({
  onSharePhotoToInbox,
  onCaptureNewPhoto,
  onOpenInboxDirectly,
}) => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<SampleDocumentPhoto[]>(SAMPLE_DOCUMENT_PHOTOS);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [isPressingId, setIsPressingId] = useState<string | null>(null);
  const [pressProgress, setPressProgress] = useState<number>(0);
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'notices' | 'trips' | 'finance'>('all');
  const [showHintToast, setShowHintToast] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const pressStartTimestamp = useRef<number>(0);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId) || null;

  // Start Long Press (Pointer Down)
  const handlePointerDown = (photo: SampleDocumentPhoto, e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    setIsPressingId(photo.id);
    setPressProgress(0);
    pressStartTimestamp.current = Date.now();

    const duration = 450; // 450ms long press threshold

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - pressStartTimestamp.current;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setPressProgress(pct);
    }, 25);

    timerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPressProgress(100);
      setIsPressingId(null);
      setSelectedPhotoId(photo.id);
      setShowShareSheet(true);
      setShowHintToast(false);

      // Trigger light vibration if available on real mobile
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch (_) {}
      }
    }, duration);
  };

  // Cancel or End Long Press (Pointer Up / Cancel)
  const handlePointerUp = (photo: SampleDocumentPhoto) => {
    const elapsed = Date.now() - pressStartTimestamp.current;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsPressingId(null);
    setPressProgress(0);

    // If released before 450ms, it was a quick tap
    if (elapsed < 420 && !showShareSheet) {
      // Select the photo and show the hint toast + bottom action bar
      setSelectedPhotoId(photo.id);
      setShowHintToast(true);
    }
  };

  // Trigger Share from bottom action bar
  const handleOpenShareSheet = () => {
    if (selectedPhotoId) {
      setShowShareSheet(true);
    }
  };

  // User taps School AI Inbox inside the Android Share Sheet
  const handleSelectSchoolInbox = () => {
    if (!selectedPhoto) return;
    setShowShareSheet(false);
    onSharePhotoToInbox(selectedPhoto);
  };

  // Add custom photo taken by camera or uploaded
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const newPhoto: SampleDocumentPhoto = {
        id: `custom_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        subtitle: '剛拍攝/上傳的通告相片',
        source: 'Camera Roll',
        dateStr: 'Today',
        previewUrl: base64,
        rawText: 'NEW NOTICE: Please read and return consent slip.',
        detectedSummary: 'Newly uploaded document photo',
        tag: 'My Photo',
      };
      setPhotos((prev) => [newPhoto, ...prev]);
      setSelectedPhotoId(newPhoto.id);
      // Also notify parent camera handler
      onCaptureNewPhoto(file);
    };
    reader.readAsDataURL(file);
  };

  const filteredPhotos = photos.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'trips') return p.tag.includes('Trip') || p.title.includes('Trip');
    if (activeCategory === 'finance') return p.tag.includes('Pay') || p.title.includes('Uniform');
    if (activeCategory === 'notices') return !p.tag.includes('Trip');
    return true;
  });

  return (
    <div className="bg-slate-900 text-white min-h-[640px] flex flex-col rounded-3xl overflow-hidden relative select-none">
      {/* Google Photos / Android Gallery Top Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-blue-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-[10px] font-black">
              GP
            </div>
          </div>
          <div>
            <span className="text-xs font-black tracking-tight text-white block">
              {t('gallery.app_name')}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>{t('gallery.os_name')}</span>
              <span className="text-emerald-400 font-semibold">• {t('gallery.tagline')}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Real Camera Snap */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            title={t('gallery.snap_title')}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Upload file */}
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            title={t('gallery.upload_title')}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-400" />
          </button>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </div>
      </div>

      {/* Prominent Long-Press Demonstration Guide */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="bg-gradient-to-r from-blue-950/90 to-indigo-950/90 border border-blue-700/60 rounded-2xl p-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 shadow-xs">
              👆
            </div>
            <div className="flex-1 text-xs">
              <span className="font-extrabold text-blue-200 block text-xs">
                {t('gallery.instructions_title')}
              </span>
              <p className="text-[11px] text-blue-300/90 mt-0.5 leading-relaxed">
                {t('gallery.instructions_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3.5 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-slate-300 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-white text-slate-900 font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {t('gallery.cat_all')} ({photos.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('notices')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'notices'
              ? 'bg-white text-slate-900 font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {t('gallery.cat_notices')}
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('trips')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'trips'
              ? 'bg-white text-slate-900 font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {t('gallery.cat_trips')}
        </button>
      </div>

      {/* Quick Tap Hint Toast */}
      {showHintToast && selectedPhoto && !showShareSheet && (
        <div className="mx-3.5 my-1 bg-amber-500/20 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-200 flex items-center justify-between gap-2 animate-in fade-in duration-150">
          <span>{t('gallery.quick_tap_toast', { title: selectedPhoto.title })}</span>
          <button
            type="button"
            onClick={handleOpenShareSheet}
            className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400 text-amber-950 shrink-0"
          >
            {t('gallery.quick_tap_btn')}
          </button>
        </div>
      )}

      {/* Gallery Photo Grid */}
      <div className="p-3.5 flex-1 overflow-y-auto grid grid-cols-2 gap-3 pb-24">
        {filteredPhotos.map((photo) => {
          const isSelected = selectedPhotoId === photo.id;
          const isPressing = isPressingId === photo.id;

          return (
            <div
              key={photo.id}
              onPointerDown={(e) => handlePointerDown(photo, e)}
              onPointerUp={() => handlePointerUp(photo)}
              onPointerCancel={() => handlePointerUp(photo)}
              onPointerLeave={() => handlePointerUp(photo)}
              className={`relative rounded-2xl overflow-hidden border bg-slate-800 transition-all duration-150 cursor-pointer select-none group ${
                isSelected
                  ? 'ring-3 ring-blue-500 border-blue-400 shadow-lg scale-[0.98]'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              {/* Image Preview Container */}
              <div className="aspect-[3/4] bg-slate-950 overflow-hidden relative">
                <img
                  src={photo.previewUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 pointer-events-none"
                />

                {/* Long-Press Radial Hold Indicator */}
                {isPressing && (
                  <div className="absolute inset-0 bg-blue-600/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-75">
                    <div className="w-14 h-14 rounded-full border-4 border-white/20 flex items-center justify-center relative shadow-xl">
                      <svg className="w-14 h-14 -rotate-90 absolute inset-0">
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-blue-400 transition-all"
                          strokeDasharray={138}
                          strokeDashoffset={138 - (138 * pressProgress) / 100}
                        />
                      </svg>
                      <Share2 className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <span className="text-[11px] font-extrabold mt-2 bg-slate-900/90 text-white px-2.5 py-0.5 rounded-full shadow-md">
                      {t('gallery.holding')} {pressProgress}%...
                    </span>
                  </div>
                )}

                {/* Android Gallery Selection Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md ring-2 ring-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Tag Badge */}
                <div className="absolute bottom-2 left-2 z-10">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-blue-200 backdrop-blur-xs">
                    {photo.tag}
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-2.5 bg-slate-900 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1 leading-snug">
                  {photo.title}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {photo.subtitle}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-blue-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <span>{t('gallery.long_press_can_share')}</span>
                  </span>
                  <Share2 className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Android Gallery Action Bar (appears when 1 or more photos are selected) */}
      {selectedPhoto && !showShareSheet && (
        <div className="absolute bottom-3 inset-x-3 z-20 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2 pl-1">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </div>
            <span className="text-xs font-bold text-slate-200 truncate max-w-[120px] sm:max-w-[180px]">
              {selectedPhoto.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedPhotoId(null)}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              {t('gallery.cancel_select')}
            </button>

            <button
              type="button"
              onClick={handleOpenShareSheet}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('gallery.share_button')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Realistic Android System Share Sheet Drawer (Slides up from bottom) */}
      {showShareSheet && selectedPhoto && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-4 sm:p-5 shadow-2xl space-y-4 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                  <img
                    src={selectedPhoto.previewUrl}
                    alt={selectedPhoto.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">
                    {t('sharesheet.title')}
                  </span>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{selectedPhoto.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareSheet(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕ {t('sharesheet.close')}
              </button>
            </div>

            {/* Android Share Targets Grid */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('sharesheet.apps_title')}
              </span>

              <div className="grid grid-cols-4 gap-2">
                {/* 1. School AI Inbox (Primary / Recommended) */}
                <button
                  type="button"
                  onClick={handleSelectSchoolInbox}
                  className="flex flex-col items-center p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg ring-2 ring-blue-400 transition-all cursor-pointer group scale-102"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-bold mb-1 shadow-md group-hover:scale-105 transition-transform">
                    <Scan className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black text-center leading-tight">School Inbox</span>
                  <span className="text-[9px] text-blue-200 font-semibold mt-0.5">{t('sharesheet.school_inbox_sub')}</span>
                </button>

                {/* 2. WhatsApp */}
                <button
                  type="button"
                  onClick={handleSelectSchoolInbox}
                  className="flex flex-col items-center p-2 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-1">
                    WA
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight">WhatsApp</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Chat</span>
                </button>

                {/* 3. Gmail */}
                <button
                  type="button"
                  onClick={handleSelectSchoolInbox}
                  className="flex flex-col items-center p-2 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold mb-1">
                    M
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight">Gmail</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Email</span>
                </button>

                {/* 4. Quick Share */}
                <button
                  type="button"
                  onClick={handleSelectSchoolInbox}
                  className="flex flex-col items-center p-2 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold mb-1">
                    QS
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight">Quick Share</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Nearby</span>
                </button>
              </div>
            </div>

            {/* Direct Confirmation Action */}
            <button
              type="button"
              onClick={handleSelectSchoolInbox}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t('sharesheet.direct_action')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
