import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  // The live hosted URL of this app
  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-qcz5c2m2m2swof7woshrlr-706030277309.asia-east1.run.app';

  // PWABuilder URL for packaging as a standalone .apk / .aab
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(
    appUrl
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
      } catch (e) {
        console.warn('Prompt error:', e);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Fallback instruction: alert user to use Chrome's top-right menu
      alert(
        'On your Android phone:\n1. Tap the Chrome menu (⋮) in the top-right corner\n2. Tap "Install app" or "Add to Home screen"\n3. Android will automatically install School AI Inbox!'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-blue-50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {t('apk.modal_title')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Android WebAPK & Standalone .APK
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* Method 1: WebAPK Direct Install (Recommended) */}
          <div className="border border-blue-200 bg-blue-50/60 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{t('apk.webapk_title')}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                No APK Download Needed
              </span>
            </div>

            <p className="text-xs text-blue-950/80 leading-relaxed">
              {t('apk.webapk_desc')}
            </p>

            {/* 3 Step Visual Guide */}
            <div className="space-y-2 bg-white/90 border border-blue-100 rounded-xl p-3 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>{t('apk.step1')}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>{t('apk.step2')}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>{t('apk.step3')}</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t('apk.step3_benefit')}</span>
            </p>

            {/* Direct Trigger Button */}
            <button
              type="button"
              onClick={handleNativeInstall}
              disabled={isInstalling}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t('apk.install_now')}</span>
            </button>
          </div>

          {/* Method 2: Standalone .APK file via PWABuilder */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4 text-slate-600" />
                <span>{t('apk.standalone_title')}</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                For Sideloading
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t('apk.standalone_desc')}
            </p>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <span>{t('apk.download_via_pwabuilder')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Copy Link Box */}
          <div className="bg-slate-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-slate-200/80">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                App URL:
              </span>
              <p className="text-xs font-mono text-slate-700 truncate">{appUrl}</p>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('apk.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('apk.copy_link')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            {t('settings.save_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
