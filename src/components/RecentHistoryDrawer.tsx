import React from 'react';
import { History, Trash2, ArrowRight, Calendar, CheckCircle2, School } from 'lucide-react';
import { ExtractedNotice } from '../types';

interface RecentHistoryDrawerProps {
  history: ExtractedNotice[];
  onSelectNotice: (notice: ExtractedNotice) => void;
  onClearHistory: () => void;
}

export const RecentHistoryDrawer: React.FC<RecentHistoryDrawerProps> = ({
  history,
  onSelectNotice,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Recently Processed Notices ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {history.slice(0, 5).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectNotice(item)}
            className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/70 p-2 rounded-xl transition-all"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                <School className="w-3 h-3 text-blue-500" />
                <span className="font-semibold text-slate-600">{item.school_name || 'School'}</span>
                <span>•</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">{item.summary}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                {item.tasks.length} task{item.tasks.length === 1 ? '' : 's'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
