import React from 'react';
import { CheckCircle2, ExternalLink, RefreshCw, Share2, Sparkles } from 'lucide-react';

interface SyncSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncedCount: number;
  listTitle: string;
  onNewNotice: () => void;
}

export const SyncSuccessModal: React.FC<SyncSuccessModalProps> = ({
  isOpen,
  onClose,
  syncedCount,
  listTitle,
  onNewNotice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Added to Google Tasks!</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Successfully created <strong className="text-slate-900 font-bold">{syncedCount} school task{syncedCount === 1 ? '' : 's'}</strong> in your Google Tasks under <span className="font-bold text-blue-600">"{listTitle}"</span>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 space-y-2 text-left">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>What happens next:</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
            <li>Tasks will notify you on your Android phone / Google Calendar app on their due dates.</li>
            <li>Items to pack and payment deadlines are saved inside the task notes.</li>
          </ul>
        </div>

        <div className="space-y-2 pt-1">
          <a
            href="https://tasks.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <span>Open Google Tasks</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNewNotice();
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Another School Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
