import React, { useState, useRef } from 'react';
import {
  Camera,
  Share2,
  X,
  Sparkles,
  Check,
  Smartphone,
  Scan,
  Image as ImageIcon,
  Clock,
  Layers,
  HandMetal,
  ArrowRight,
} from 'lucide-react';
import { SAMPLE_DOCUMENT_PHOTOS, SampleDocumentPhoto } from '../data/sampleDocuments';

interface AndroidPhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSharePhotoToApp: (photo: SampleDocumentPhoto) => void;
  onCaptureNewPhoto: (file: File) => void;
}

export const AndroidPhotoGalleryModal: React.FC<AndroidPhotoGalleryModalProps> = ({
  isOpen,
  onClose,
  onSharePhotoToApp,
  onCaptureNewPhoto,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<SampleDocumentPhoto | null>(null);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [pressingId, setPressingId] = useState<string | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleStartPress = (photo: SampleDocumentPhoto, e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setPressingId(photo.id);
    setSelectedPhoto(photo);
    setLongPressProgress(0);

    const startTime = Date.now();
    const duration = 450; // 450ms for long press

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setLongPressProgress(progress);
    }, 25);

    longPressTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setLongPressProgress(100);
      setShowShareSheet(true);
      setPressingId(null);
    }, duration);
  };

  const handleCancelPress = (photo?: SampleDocumentPhoto) => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setPressingId(null);
    setLongPressProgress(0);
  };

  const handleExecuteShare = () => {
    if (!selectedPhoto) return;
    setShowShareSheet(false);
    onClose();
    onSharePhotoToApp(selectedPhoto);
  };

  const handleCameraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onCaptureNewPhoto(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Gallery Top Bar imitating Android Google Photos / Gallery */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>Android Photos & Camera</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Long-Press Demo
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Long-press (or tap) any document photo to trigger Android Share
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera action banner */}
        <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Have a physical paper notice in your hand?</span>
          </div>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snap Document Photo</span>
          </button>

          {/* Hidden real camera capture input */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCameraFileChange}
          />
        </div>

        {/* Instruction pill */}
        <div className="px-4 pt-3 pb-1">
          <div className="bg-blue-950/60 border border-blue-800/60 rounded-xl p-2.5 text-xs text-blue-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>
                <strong>How it works:</strong> Long press any letter below to open the Android Share Sheet!
              </span>
            </div>
          </div>
        </div>

        {/* Document Photos Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 gap-3">
          {SAMPLE_DOCUMENT_PHOTOS.map((doc) => {
            const isPressing = pressingId === doc.id;
            const isSelected = selectedPhoto?.id === doc.id;

            return (
              <div
                key={doc.id}
                onPointerDown={(e) => handleStartPress(doc, e)}
                onPointerUp={() => handleCancelPress(doc)}
                onPointerCancel={() => handleCancelPress(doc)}
                onPointerLeave={() => handleCancelPress(doc)}
                className={`relative rounded-2xl overflow-hidden border bg-slate-800 transition-all cursor-pointer group select-none ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-blue-400 scale-[0.99]'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                {/* Document paper image */}
                <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                  <img
                    src={doc.previewUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                  />

                  {/* Long press circular feedback indicator */}
                  {isPressing && (
                    <div className="absolute inset-0 bg-blue-600/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-20">
                      <div className="w-14 h-14 rounded-full border-4 border-white/20 flex items-center justify-center relative shadow-lg">
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
                            strokeDashoffset={138 - (138 * longPressProgress) / 100}
                          />
                        </svg>
                        <Share2 className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <span className="text-[10px] font-bold mt-1.5 bg-black/75 px-2.5 py-0.5 rounded-full">
                        長按中 {longPressProgress}%...
                      </span>
                    </div>
                  )}

                  {/* Tag badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/85 text-blue-300 backdrop-blur-xs border border-slate-700">
                      {doc.tag}
                    </span>
                  </div>

                  {/* Date badge */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-black/70 text-slate-300 backdrop-blur-xs">
                      {doc.dateStr}
                    </span>
                  </div>
                </div>

                {/* Card caption */}
                <div className="p-2.5 bg-slate-900">
                  <h4 className="text-xs font-bold text-slate-200 line-clamp-1 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {doc.subtitle}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-blue-400 font-semibold">
                    <span>Long-press to share</span>
                    <Share2 className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Realistic Android Share Sheet Modal / Drawer */}
        {showShareSheet && selectedPhoto && (
          <div className="p-4 bg-slate-800 border-t border-slate-700 animate-in slide-in-from-bottom duration-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200">Share 1 Document Photo</span>
                <p className="text-[11px] text-slate-400 truncate max-w-xs">{selectedPhoto.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareSheet(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {/* Android Share targets */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {/* PRIMARY: School AI Inbox */}
              <button
                type="button"
                onClick={handleExecuteShare}
                className="flex flex-col items-center p-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg ring-2 ring-blue-400 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center font-bold mb-1 shadow-xs group-hover:scale-105 transition-transform">
                  <Scan className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-center leading-tight">School AI Inbox</span>
                <span className="text-[9px] text-blue-200 font-medium mt-0.5">OCR & Tasks</span>
              </button>

              {/* Fake WhatsApp */}
              <button
                type="button"
                onClick={handleExecuteShare}
                className="flex flex-col items-center p-2 rounded-2xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer opacity-70 hover:opacity-100"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-1">
                  WA
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">WhatsApp</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Chat</span>
              </button>

              {/* Fake Drive */}
              <button
                type="button"
                onClick={handleExecuteShare}
                className="flex flex-col items-center p-2 rounded-2xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer opacity-70 hover:opacity-100"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold mb-1">
                  GD
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">Google Drive</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Cloud</span>
              </button>

              {/* Fake Gmail */}
              <button
                type="button"
                onClick={handleExecuteShare}
                className="flex flex-col items-center p-2 rounded-2xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer opacity-70 hover:opacity-100"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold mb-1">
                  M
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">Gmail</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Email</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExecuteShare}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Share to School AI Inbox (OCR Read First)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
