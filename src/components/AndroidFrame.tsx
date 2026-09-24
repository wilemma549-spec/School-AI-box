import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  enabled: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <div className="w-full max-w-3xl mx-auto px-4 py-4">{children}</div>;
  }

  return (
    <div className="py-4 px-2 sm:px-4 flex justify-center items-start min-h-[calc(100vh-60px)]">
      {/* Android Device Mockup */}
      <div className="w-full max-w-[420px] bg-white rounded-[40px] shadow-2xl border-[10px] border-slate-800 overflow-hidden ring-1 ring-slate-900/10 flex flex-col relative transition-all">
        {/* Android Punch Hole Camera & Status Bar */}
        <div className="bg-slate-900 text-white px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold select-none">
          <span>09:41</span>
          {/* Camera cut-out */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-700/80 mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="p-3.5 max-h-[82vh] overflow-y-auto bg-slate-50/70 flex-1">
          {children}
        </div>

        {/* Android Bottom Navigation Pill */}
        <div className="bg-white py-2 flex justify-center items-center border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
