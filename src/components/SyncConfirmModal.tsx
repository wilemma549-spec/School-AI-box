import React from 'react';
import { Check, X, AlertCircle, FileCheck, Clock, ListChecks } from 'lucide-react';
import { SchoolNoticeItem } from '../types';

interface SyncConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSyncing: boolean;
  tasksToSync: SchoolNoticeItem[];
  targetListTitle: string;
  noticeTitle: string;
}

export const SyncConfirmModal: React.FC<SyncConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSyncing,
  tasksToSync,
  targetListTitle,
  noticeTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add to Google Tasks?</h3>
              <p className="text-xs text-slate-500">Confirm task creation in your Google account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSyncing}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 space-y-1">
            <p>
              School AI Inbox will create <strong className="font-bold">{tasksToSync.length} task{tasksToSync.length === 1 ? '' : 's'}</strong> in your Google Tasks list:
            </p>
            <p className="font-bold text-blue-700 flex items-center gap-1">
              <ListChecks className="w-3.5 h-3.5" />
              <span>{targetListTitle}</span>
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              即將射入 Google Tasks 的項目 ({tasksToSync.length}):
            </span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
              {tasksToSync.map((t, idx) => (
                <div key={t.id} className="pt-1.5 first:pt-0">
                  <div className="flex items-start justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-800 leading-snug">
                      {idx + 1}. {t.child_name && !t.title.startsWith(t.child_name) ? `${t.child_name}: ` : ''}{t.title}
                    </span>
                    {t.due_date && (
                      <span className="text-[10px] font-medium text-slate-500 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                        Due: {t.due_date}
                      </span>
                    )}
                  </div>
                  {t.notes && <p className="text-[10px] text-slate-400 truncate mt-0.5">{t.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            每個任務均已還原真實姓名，並自動備註截止日期、金額與攜帶物品。
          </p>
        </div>

        {/* Footer buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSyncing}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSyncing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>正在射入 Google Tasks...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>🚀 確認射入 Google Tasks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
