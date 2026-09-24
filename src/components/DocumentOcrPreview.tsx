import React, { useState } from 'react';
import {
  FileText,
  Scan,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Edit3,
  Copy,
  Check,
  RefreshCw,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { OcrResult } from '../types';

interface DocumentOcrPreviewProps {
  imagePreview: string;
  ocrResult: OcrResult | null;
  isScanning: boolean;
  onProceedToTasks: (finalText: string) => void;
  onRetake: () => void;
}

export const DocumentOcrPreview: React.FC<DocumentOcrPreviewProps> = ({
  imagePreview,
  ocrResult,
  isScanning,
  onProceedToTasks,
  onRetake,
}) => {
  const [editedText, setEditedText] = useState(ocrResult?.raw_text || '');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync editedText when ocrResult updates
  React.useEffect(() => {
    if (ocrResult?.raw_text) {
      setEditedText(ocrResult.raw_text);
    }
  }, [ocrResult]);

  const handleCopy = () => {
    if (!editedText) return;
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    onProceedToTasks(editedText || ocrResult?.raw_text || '');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Scan className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">Step 1: Document OCR Read</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                OCR First
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isScanning
                ? 'Optical Character Recognition in progress...'
                : `Transcribed ${ocrResult?.word_count || 0} words with ${ocrResult?.confidence || 98}% confidence`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetake}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
        >
          Change Photo
        </button>
      </div>

      {/* Grid: Document Image Preview + Scanner Beam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Document image with active scanner effect */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center min-h-[220px] max-h-[340px]">
          <img
            src={imagePreview}
            alt="Scanned school document photo"
            className="w-full h-full object-contain max-h-[340px]"
          />

          {/* Scanner laser beam animation */}
          {isScanning ? (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce" />
              <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[0.5px]" />
              <div className="absolute bottom-3 left-3 bg-black/75 text-emerald-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Reading physical document...</span>
              </div>
            </div>
          ) : (
            <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Document OCR Captured</span>
            </div>
          )}
        </div>

        {/* Right: OCR Transcribed Text */}
        <div className="flex flex-col h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Transcribed Document Text:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy OCR text"
                className="text-[11px] text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 px-2 py-0.5 rounded hover:bg-blue-50 font-medium"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Done' : 'Edit Text'}</span>
              </button>
            </div>
          </div>

          {/* OCR text display / edit container */}
          <div className="flex-1 min-h-[170px]">
            {isScanning ? (
              <div className="h-full min-h-[180px] bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                <p className="font-semibold text-slate-600">Extracting text from document photo...</p>
                <p className="text-[11px] text-slate-400 text-center max-w-xs">
                  Recognizing printed headings, deadlines, kit lists, and reply slips.
                </p>
              </div>
            ) : isEditing ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={8}
                className="w-full h-full min-h-[180px] text-xs text-slate-800 bg-white border border-blue-400 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed resize-none"
              />
            ) : (
              <div className="h-full min-h-[180px] max-h-[220px] bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {editedText || ocrResult?.raw_text || 'No text extracted.'}
              </div>
            )}
          </div>

          {/* Key detected lines badges */}
          {ocrResult?.detected_lines && ocrResult.detected_lines.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Detected Notice Elements:
              </span>
              <div className="flex flex-wrap gap-1">
                {ocrResult.detected_lines.slice(0, 3).map((line, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md truncate max-w-[220px]"
                  >
                    ✓ {line}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>OCR 識別完成 • 下一步將在本地脫敏 (借走個名) 再提取任務</span>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isScanning || (!editedText.trim() && !ocrResult?.raw_text)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Step 2: Extract To-Dos & Sync to Google Tasks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
