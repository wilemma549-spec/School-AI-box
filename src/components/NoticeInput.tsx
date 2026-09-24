import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Share2,
  FileText,
  Image as ImageIcon,
  Clipboard,
  X,
  ArrowRight,
  MessageSquare,
  School,
  Calendar,
  AlertCircle,
  HelpCircle,
  Upload,
  Camera,
  Scan,
  Smartphone,
  ShieldCheck,
  Lock,
  Eye,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_NOTICES, SampleNotice } from '../data/sampleNotices';
import { SAMPLE_DOCUMENT_PHOTOS, SampleDocumentPhoto } from '../data/sampleDocuments';
import { redactText } from '../services/redaction';
import { RedactionShieldModal } from './RedactionShieldModal';
import { useTranslation } from '../i18n/LanguageContext';

interface NoticeInputProps {
  onAnalyze: (
    text: string,
    imageBase64?: string,
    mimeType?: string,
    knownChildren?: string[],
    enableRedaction?: boolean
  ) => Promise<void>;
  onStartDocumentOcr: (imageBase64: string, mimeType?: string, initialText?: string) => void;
  onOpenGalleryModal: () => void;
  onSwitchToGallery?: () => void;
  isLoading: boolean;
  initialText?: string;
  knownChildren?: string[];
  onUpdateChildren?: (children: string[]) => void;
}

export const NoticeInput: React.FC<NoticeInputProps> = ({
  onAnalyze,
  onStartDocumentOcr,
  onOpenGalleryModal,
  onSwitchToGallery,
  isLoading,
  initialText = '',
  knownChildren: propKnownChildren,
  onUpdateChildren,
}) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState(initialText);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputTab, setInputTab] = useState<'simulator' | 'photoGallery' | 'cameraOcr' | 'text'>('simulator');
  const [loadingStep, setLoadingStep] = useState(0);

  // On-device privacy states
  const [internalChildren, setInternalChildren] = useState<string[]>(['Oliver', 'Leo', 'Emily', '陳小明']);
  const knownChildren = propKnownChildren || internalChildren;
  const setKnownChildren = (kids: string[]) => {
    setInternalChildren(kids);
    onUpdateChildren?.(kids);
  };
  const [enableRedaction, setEnableRedaction] = useState<boolean>(true);
  const [showShieldModal, setShowShieldModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Live on-device redaction report calculation
  const liveRedactionReport = enableRedaction ? redactText(inputText, knownChildren) : null;

  // When initialText changes (e.g. from Web Share Target URL query params)
  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      setInputTab('text');
    }
  }, [initialText]);

  // Loading step progression
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSelectSample = (sample: SampleNotice) => {
    setSelectedSample(sample.id);
    setInputText(sample.text);
    setImagePreview(null);
    setImageMimeType(null);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setSelectedSample(null);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleImageFile = (file: File, triggerOcrDirectly: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      setImageMimeType(file.type);

      if (triggerOcrDirectly) {
        onStartDocumentOcr(base64, file.type, '');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0], true);
    }
  };

  const handlePasteEvent = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleImageFile(file, true);
          return;
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !imagePreview) return;
    onAnalyze(
      inputText.trim(),
      imagePreview || undefined,
      imageMimeType || undefined,
      knownChildren,
      enableRedaction
    );
  };

  return (
    <div className="space-y-4" onPaste={handlePasteEvent}>
      {/* Hero card explaining the prototype */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-medium mb-2.5 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('hero.badge')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {t('hero.title_line1')}
            <br className="hidden sm:inline" /> {t('hero.title_line2')}
          </h2>
          <p className="text-sm text-blue-100/90 mt-1.5 max-w-xl">
            {t('hero.description')}
          </p>
        </div>
      </div>

      {/* On-device Privacy Redaction Shield Banner */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">{t('privacy.banner_title')}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {t('privacy.badge')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('privacy.banner_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setShowShieldModal(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>{t('privacy.how_it_works')}</span>
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableRedaction}
                onChange={(e) => setEnableRedaction(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Live tokens badge if detected in text */}
        {enableRedaction && liveRedactionReport && liveRedactionReport.tokens.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t('privacy.tokens_redacted', { count: liveRedactionReport.tokens.length })}</span>
            </span>
            {liveRedactionReport.tokens.map((token, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200"
              >
                <span className="line-through text-slate-400">{token.original}</span>
                <span className="text-blue-400 font-mono font-bold">➔ {token.placeholder}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Feature banner: Long Press & OCR Read First */}
      <div className="bg-emerald-950 text-white border border-emerald-800 rounded-2xl p-3.5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Scan className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-200">{t('core_flow.title')}</span>
              <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200">
                {t('core_flow.badge')}
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              {t('core_flow.desc')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => (onSwitchToGallery ? onSwitchToGallery() : onOpenGalleryModal())}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{t('core_flow.button')}</span>
        </button>
      </div>

      {/* Mode selection tabs */}
      <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => setInputTab('simulator')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all ${
            inputTab === 'simulator'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('tab.text_share')}</span>
        </button>
        <button
          type="button"
          onClick={() => setInputTab('photoGallery')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all ${
            inputTab === 'photoGallery'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('tab.photo_gallery')}</span>
        </button>
        <button
          type="button"
          onClick={() => setInputTab('cameraOcr')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all ${
            inputTab === 'cameraOcr'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('tab.camera_ocr')}</span>
        </button>
        <button
          type="button"
          onClick={() => setInputTab('text')}
          className={`flex items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all ${
            inputTab === 'text'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('tab.paste_text')}</span>
        </button>
      </div>

      {/* TAB 1: Long Press Document Photo in Android Gallery */}
      {inputTab === 'photoGallery' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>{t('tab_gallery.title')}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  {t('tab_gallery.badge')}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('tab_gallery.subtitle')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => (onSwitchToGallery ? onSwitchToGallery() : onOpenGalleryModal())}
              className="inline-flex items-center justify-center gap-1 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              <span>{t('tab_gallery.switch_button')}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {SAMPLE_DOCUMENT_PHOTOS.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenGalleryModal()}
                className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-slate-50 text-left"
              >
                <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative">
                  <img
                    src={doc.previewUrl}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors" />
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/75 text-blue-200 backdrop-blur-xs">
                    {doc.tag}
                  </span>
                  <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    <Share2 className="w-2.5 h-2.5" />
                    <span>{t('tab_gallery.sample_hold_hint')}</span>
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{doc.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-900">
            <div>
              <span className="font-bold block">{t('tab_gallery.test_hint_title')}</span>
              <span className="text-[11px] text-blue-700">
                {t('tab_gallery.test_hint_desc')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => (onSwitchToGallery ? onSwitchToGallery() : onOpenGalleryModal())}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              <span>{t('tab_gallery.test_button')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Camera & Document Snap with OCR Read First */}
      {inputTab === 'cameraOcr' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('camera.title')}</h3>
              <p className="text-xs text-slate-500">
                {t('camera.subtitle')}
              </p>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageMimeType(null);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('camera.remove')}</span>
              </button>
            )}
          </div>

          {!imagePreview ? (
            <div className="space-y-3">
              <div
                onClick={() => cameraInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl p-6 text-center cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform shadow-xs">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {t('camera.snap_button')}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  {t('camera.snap_desc')}
                </p>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <p className="text-xs font-semibold text-slate-700">{t('camera.drop_hint')}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t('camera.browse_files')}</p>
              </div>

              {/* Hidden camera & file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0], true);
                  }
                }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0], true);
                  }
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-60 flex items-center justify-center p-2">
                <img
                  src={imagePreview}
                  alt="School notice screenshot preview"
                  className="max-h-56 rounded-lg object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() => onStartDocumentOcr(imagePreview, imageMimeType || 'image/jpeg', '')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>{t('camera.start_ocr_button')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Text Share Simulator */}
      {inputTab === 'simulator' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900">{t('sim.title')}</h3>
            </div>
            <span className="text-xs text-slate-500">{t('sim.subtitle')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAMPLE_NOTICES.map((sample) => {
              const isSelected = selectedSample === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left p-3 rounded-xl border transition-all relative cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${sample.badgeColor}`}
                    >
                      {sample.source}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded-full">
                        {t('sim.selected')}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{sample.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{sample.preview}</p>
                </button>
              );
            })}
          </div>

          {inputText && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold text-slate-700">{t('sim.preview_title')}</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('');
                    setSelectedSample(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
                >
                  {t('sim.clear')}
                </button>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 max-h-36 overflow-y-auto whitespace-pre-wrap font-sans">
                {inputText}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Manual text input view */}
      {inputTab === 'text' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="notice-text" className="text-sm font-bold text-slate-900">
              {t('paste.title')}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Clipboard className="w-3 h-3" />
                <span>{t('paste.paste_clipboard')}</span>
              </button>
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {t('paste.clear')}
                </button>
              )}
            </div>
          </div>

          <textarea
            id="notice-text"
            rows={6}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSelectedSample(null);
            }}
            placeholder={t('paste.placeholder')}
            className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white resize-y"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{t('paste.support_types')}</span>
            <span>{inputText.length} characters</span>
          </div>
        </div>
      )}

      {/* Primary Action Button (for Text and Simulator tabs) */}
      {(inputTab === 'simulator' || inputTab === 'text') && (
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !inputText.trim()}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {loadingStep === 0 && t('loading.step0')}
                  {loadingStep === 1 && t('loading.step1')}
                  {loadingStep === 2 && t('loading.step2')}
                </span>
              </div>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>
                  {enableRedaction ? t('action.extract_redacted') : t('action.extract_standard')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Privacy Redaction Shield Modal */}
      <RedactionShieldModal
        isOpen={showShieldModal}
        onClose={() => setShowShieldModal(false)}
        report={liveRedactionReport || undefined}
        childName={knownChildren.join(', ')}
        onAddKnownChild={(name) => {
          if (!knownChildren.includes(name)) {
            setKnownChildren([...knownChildren, name]);
          }
        }}
      />
    </div>
  );
};
