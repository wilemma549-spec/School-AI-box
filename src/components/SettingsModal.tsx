import React, { useState } from 'react';
import {
  X,
  Languages,
  Check,
  Shield,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  PoundSterling,
  Download,
  Smartphone,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { LANGUAGE_OPTIONS, SupportedLanguage } from '../i18n/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  knownChildren: string[];
  onUpdateChildren: (children: string[]) => void;
  onOpenInstallApk?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  knownChildren,
  onUpdateChildren,
  onOpenInstallApk,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [newChildName, setNewChildName] = useState('');

  if (!isOpen) return null;

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newChildName.trim();
    if (!trimmed) return;
    if (!knownChildren.includes(trimmed)) {
      onUpdateChildren([...knownChildren, trimmed]);
    }
    setNewChildName('');
  };

  const handleRemoveChild = (name: string) => {
    onUpdateChildren(knownChildren.filter((c) => c !== name));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {t('settings.title')}
              </h3>
              <p className="text-[11px] text-slate-500">
                UK Template & Language Selection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Section 1: Language Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900">
                {t('settings.language_section')}
              </span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                UK Primary
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2.5">
              {t('settings.language_desc')}
            </p>

            <div className="space-y-2">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLanguage(opt.code)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {opt.nativeLabel}
                          </span>
                          {opt.code === 'en' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                              Default (UK)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {opt.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Child Profiles for On-Device Redaction */}
          <div className="border-t border-slate-100 pt-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('settings.children_section')}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
              {t('settings.children_desc')}
            </p>

            {/* List of registered children */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {knownChildren.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <span>{name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChild(name)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer ml-0.5"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add child input form */}
            <form onSubmit={handleAddChild} className="flex gap-2">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder={t('settings.add_child_placeholder')}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
              />
              <button
                type="submit"
                disabled={!newChildName.trim()}
                className="inline-flex items-center gap-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('settings.add_child_btn')}</span>
              </button>
            </form>
          </div>

          {/* Section 3: UK School Standards */}
          <div className="border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              {t('settings.uk_defaults_section')}
            </span>
            <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-600 space-y-1 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <PoundSterling className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('settings.uk_currency')}</span>
              </div>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                {t('settings.uk_portals')}
              </p>
            </div>
          </div>

          {/* Section 4: Android App / APK Download */}
          {onOpenInstallApk && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Android App / APK
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInstallApk();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 hover:from-blue-100 hover:to-indigo-100 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">{t('apk.button')}</span>
                    <span className="text-[10px] text-blue-700">WebAPK 1-Tap Install & .APK Download</span>
                  </div>
                </div>
                <Smartphone className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {t('settings.save_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
