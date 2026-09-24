import React from 'react';
import { User } from 'firebase/auth';
import {
  Smartphone,
  Monitor,
  CheckCircle2,
  LogOut,
  Sparkles,
  Inbox,
  RefreshCw,
  Image as ImageIcon,
  Settings,
  Download,
} from 'lucide-react';
import { GoogleTaskList } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { LANGUAGE_OPTIONS } from '../i18n/types';

interface HeaderProps {
  user: User | null;
  taskLists: GoogleTaskList[];
  selectedListId: string;
  onSelectListId: (id: string) => void;
  onGoogleSignIn: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onRefreshLists: () => void;
  activeScreen?: 'inbox' | 'gallery';
  onSwitchScreen?: (screen: 'inbox' | 'gallery') => void;
  onOpenSettings: () => void;
  onOpenInstallApk: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  taskLists,
  selectedListId,
  onSelectListId,
  onGoogleSignIn,
  onLogout,
  isLoggingIn,
  isMobileFrame,
  onToggleFrame,
  onRefreshLists,
  activeScreen = 'inbox',
  onSwitchScreen,
  onOpenSettings,
  onOpenInstallApk,
}) => {
  const { t, language } = useTranslation();
  const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-none">
                {t('app.title')}
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {t('app.badge')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Center / Mode Switcher: Android Gallery (Long-Press) vs School AI Inbox */}
        {onSwitchScreen && (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onSwitchScreen('gallery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeScreen === 'gallery'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('nav.gallery_mode')}</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchScreen('inbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeScreen === 'inbox'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>{t('nav.inbox_mode')}</span>
            </button>
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Frame view toggle */}
          <button
            onClick={onToggleFrame}
            title={isMobileFrame ? t('nav.full_width') : t('nav.android_frame')}
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>{t('nav.full_width')}</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>{t('nav.android_frame')}</span>
              </>
            )}
          </button>

          {/* User Auth or Sign-in button */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Task list picker */}
              {taskLists.length > 0 && (
                <div className="hidden lg:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
                  <span className="text-slate-500">{t('nav.tasks_label')}</span>
                  <select
                    value={selectedListId}
                    onChange={(e) => onSelectListId(e.target.value)}
                    className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    {taskLists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={onRefreshLists}
                    title={t('nav.refresh_lists')}
                    className="text-slate-400 hover:text-slate-600 ml-1 p-0.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Profile badge */}
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-8 h-8 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                    {user.email ? user.email[0].toUpperCase() : 'G'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium leading-none">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Tasks Connected</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title={t('nav.logout')}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onGoogleSignIn}
              disabled={isLoggingIn}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium border border-slate-300 rounded-lg px-3 py-1.5 shadow-2xs hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isLoggingIn ? t('nav.connecting') : t('nav.connect_google')}</span>
            </button>
          )}

          {/* Install APK / App button */}
          <button
            type="button"
            onClick={onOpenInstallApk}
            title={t('apk.button')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer shadow-2xs font-semibold text-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">{t('apk.button')}</span>
          </button>

          {/* Setting Icon on Top Right Corner as requested */}
          <button
            type="button"
            onClick={onOpenSettings}
            title={t('nav.settings')}
            className="flex items-center gap-1.5 p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold leading-none hidden sm:inline-flex items-center gap-1">
              <span>{currentLang.flag}</span>
              <span className="text-[11px] uppercase font-semibold text-slate-700">
                {language === 'en' ? 'EN' : language === 'zh-HK' ? '繁' : '简'}
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

