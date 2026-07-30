import React from 'react';
import { Phone, Calendar, ArrowUp } from 'lucide-react';
import { PHONE_NUMBERS } from '../data/mockData';

interface FloatingCallBarProps {
  onOpenBooking: () => void;
}

export const FloatingCallBar: React.FC<FloatingCallBarProps> = ({ onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-2 sm:px-4">
        
        {/* Phone Buttons */}
        <div className="flex items-center space-x-2 text-xs font-bold text-white">
          <a
            href={`tel:${PHONE_NUMBERS.representative.replace('-', '')}`}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">대표</span>
            <strong className="text-white font-extrabold">{PHONE_NUMBERS.representative}</strong>
          </a>

          <a
            href={`tel:${PHONE_NUMBERS.reservation.replace('-', '')}`}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden xs:inline">예약</span>
            <strong className="text-amber-200 font-extrabold">{PHONE_NUMBERS.reservation}</strong>
          </a>
        </div>

        {/* Quick Booking CTA & Scroll top */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center space-x-1.5 transform active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>실시간 간편 예약</span>
          </button>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="맨 위로"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
