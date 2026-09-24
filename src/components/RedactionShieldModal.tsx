import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, UserCheck, School, Phone, CheckCircle2, Sparkles, X } from 'lucide-react';
import { RedactionReport } from '../types';

interface RedactionShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: RedactionReport;
  childName?: string;
  onAddKnownChild?: (name: string) => void;
}

export const RedactionShieldModal: React.FC<RedactionShieldModalProps> = ({
  isOpen,
  onClose,
  report,
  childName,
  onAddKnownChild,
}) => {
  const [newChildInput, setNewChildInput] = useState('');
  const [showRawComparison, setShowRawComparison] = useState(true);

  if (!isOpen) return null;

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildInput.trim()) return;
    onAddKnownChild?.(newChildInput.trim());
    setNewChildInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">本地隱私脫敏保護 (On-Device Redaction)</h3>
              <p className="text-xs text-slate-500">「借走個名」：真實個資 100% 留喺你部手機</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* How it works banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-emerald-950">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>三步零洩漏隱私技術 (Privacy By Design)</span>
          </div>
          <ol className="list-decimal pl-4 space-y-1 text-emerald-800 text-[11px] leading-relaxed">
            <li><strong>本地抽走真實資料</strong>：手機將「陳小明」換成 <code className="bg-white px-1 rounded text-emerald-700 font-mono">[CHILD_1]</code>、學校換成 <code className="bg-white px-1 rounded text-emerald-700 font-mono">[SCHOOL]</code>。</li>
            <li><strong>匿名送出</strong>：AI 雲端 API 只能看到「某個小朋友要帶水樽、交 £14.50」，絕不知道真實姓名與學校。</li>
            <li><strong>本地還原</strong>：分析完成後，手機在本地把名字還原成你的真實小朋友。</li>
          </ol>
        </div>

        {/* Redacted Tokens in Current Notice */}
        {report && report.tokens.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>本次已在手機本地脫敏的個資項目 ({report.tokens.length})：</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% 本地借走
              </span>
            </div>
            <div className="space-y-1.5">
              {report.tokens.map((token, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                      {token.placeholder}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold text-slate-800">{token.original}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                    {token.category === 'child' ? '小朋友姓名' : token.category === 'school' ? '學校名稱' : token.category === 'teacher' ? '教職員' : '聯絡資訊'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            目前通告未包含敏感名稱，或已完全匿名處理。
          </div>
        )}

        {/* Live Comparison Viewer */}
        {report && (
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => setShowRawComparison(!showRawComparison)}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-between w-full"
            >
              <span>查看傳送到 AI 雲端的純匿名文字</span>
              <span className="text-blue-600 text-[11px] font-semibold">
                {showRawComparison ? '收起' : '展開對比'}
              </span>
            </button>
            {showRawComparison && (
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 border-b border-slate-800 pb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>實際傳送給 AI 的匿名內容（絕無個人名字）：</span>
                </div>
                {report.anonymizedText}
              </div>
            )}
          </div>
        )}

        {/* Register Child Profiles */}
        <div className="border-t border-slate-100 pt-3 space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            登記你嘅小朋友名稱（確保本地 100% 借走名字）：
          </label>
          <form onSubmit={handleAddChild} className="flex gap-2">
            <input
              type="text"
              value={newChildInput}
              onChange={(e) => setNewChildInput(e.target.value)}
              placeholder="例如：陳小明 或 Leo"
              className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              加入名冊
            </button>
          </form>
          {childName && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span>現正保護中的小朋友：</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {childName}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            我明白，返回確認畫面
          </button>
        </div>
      </div>
    </div>
  );
};
