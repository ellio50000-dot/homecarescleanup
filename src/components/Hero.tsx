import React from 'react';
import { ShieldCheck, Phone, CheckCircle2, Sparkles, Star, Calendar, Clock, Award, ArrowRight, Zap } from 'lucide-react';
import { PHONE_NUMBERS } from '../data/mockData';
import { useCMS } from '../context/CMSContext';

interface HeroProps {
  onOpenBooking: (applianceId?: string) => void;
  onOpenPartnerModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenPartnerModal }) => {
  const { cmsData } = useCMS();
  const banner = cmsData.banner;
  return (
    <section id="hero" className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden py-12 lg:py-20">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Prominent Regional Service Notice Banner (High Visibility Colors) */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-2xl border-2 border-yellow-200 mb-8 transition-all hover:shadow-amber-500/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-600 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-sm animate-pulse flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  <span>전북 전지역 출장가능</span>
                </span>
                <span className="bg-slate-900 text-amber-300 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                  실시간 예약 & 무료 상담
                </span>
              </div>
              <p className="text-base sm:text-lg lg:text-xl font-black text-slate-950 tracking-tight leading-snug">
                전북 전지역 에어컨 · 세탁기 · 건조기 · 공기청정기 · 제습기 · 냉장고 분해청소 전문업체
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 flex flex-wrap items-center gap-1.5">
                <span className="text-red-700 font-black">📍 출장 가능 지역:</span>
                <span>전주 · 익산 · 군산 · 김제 · 정읍 · 남원 전북권 전지역 출장 가능</span>
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={() => onOpenBooking()}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-300 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>실시간 간편예약</span>
              </button>
              <a
                href={`tel:${PHONE_NUMBERS.reservation.replace('-', '')}`}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>무료 전화상담</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badges */}
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>대한민국 No.1 가전 완전분해 세척 전문</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>고객 만족도 99.4%</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {banner.title}
            </h1>

            {/* Paragraph */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
              {banner.subtitle}
            </p>

            {/* Key Value Props List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs font-medium text-slate-200">
              <div className="flex items-center space-x-1.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% 완전 분해</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>맞춤 살균 소독</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>친환경 세제 사용</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>철저한 A/S 보증</span>
              </div>
            </div>

            {/* Phone CTA Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${PHONE_NUMBERS.representative.replace('-', '')}`}
                className="group flex items-center justify-between p-3.5 bg-gradient-to-r from-blue-900/80 to-slate-800/80 hover:from-blue-800 hover:to-slate-700 rounded-2xl border border-blue-500/30 transition-all shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300 font-semibold">대표 상담 센터</div>
                    <div className="text-lg font-black text-white group-hover:text-blue-300 transition-colors">
                      {PHONE_NUMBERS.representative}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={`tel:${PHONE_NUMBERS.reservation.replace('-', '')}`}
                className="group flex items-center justify-between p-3.5 bg-gradient-to-r from-indigo-900/80 to-slate-800/80 hover:from-indigo-800 hover:to-slate-700 rounded-2xl border border-indigo-500/30 transition-all shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                    <Phone className="w-5 h-5 text-amber-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300 font-semibold">직통 빠른 예약</div>
                    <div className="text-lg font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                      {PHONE_NUMBERS.reservation}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-600/30 transition-all transform active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>온라인 실시간 간편 예약</span>
              </button>

              <button
                onClick={onOpenPartnerModal}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-sm rounded-xl transition-all"
              >
                <span>🤝 협력기사 & 홈케어 교육생 수시모집 (수수료 75%+)</span>
              </button>
            </div>
          </div>

          {/* Right Floating Quick Service Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-6 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>빠른 가전 세척 견적 선택</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">클릭하면 해당 가전 예약으로 바로 연결됩니다</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  다중 할인 혜택
                </span>
              </div>

              {/* Grid of 6 appliances */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'aircon', name: '에어컨', tag: '벽걸이/스탠드/시스템', price: '80,000원~', icon: '❄️' },
                  { id: 'washer', name: '세탁기', tag: '통돌이/드럼/워시타워', price: '100,000원~', icon: '🧺' },
                  { id: 'dryer', name: '건조기', tag: '콘덴서/히트펌프', price: '60,000원~', icon: '☀️' },
                  { id: 'purifier', name: '공기청정기', tag: '타워/가습겸용', price: '80,000원~', icon: '🍃' },
                  { id: 'dehumidifier', name: '제습기', tag: '가정용/대용량', price: '80,000원~', icon: '💧' },
                  { id: 'fridge', name: '냉장고', tag: '양문형/4도어/김치', price: '110,000원~', icon: '🧊' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onOpenBooking(item.id)}
                    className="group flex flex-col justify-between p-3 bg-slate-800/70 hover:bg-blue-900/60 border border-slate-700/60 hover:border-blue-400/50 rounded-2xl transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-[10px] font-semibold text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                        {item.price}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{item.tag}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bottom Guarantee Stat */}
              <div className="pt-2 text-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                <div className="grid grid-cols-3 divide-x divide-slate-700 text-center">
                  <div>
                    <div className="text-base font-black text-blue-400">12만건+</div>
                    <div className="text-[10px] text-slate-400">누적 세척실적</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-indigo-400">100%</div>
                    <div className="text-[10px] text-slate-400">분해살균보증</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-emerald-400">100%</div>
                    <div className="text-[10px] text-slate-400">철저한 A/S 보증</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
