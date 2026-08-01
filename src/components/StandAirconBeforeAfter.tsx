import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn, Image as ImageIcon, CheckCircle2, AlertTriangle, Sparkles, CalendarCheck } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface StandAirconBeforeAfterProps {
  onOpenBooking?: () => void;
}

// Default part descriptions if missing
const DEFAULT_PARTS: Record<string, string> = {
  '벽걸이 에어컨': '송풍팬(블로워팬) 분해 전·후',
  '스탠드 에어컨': '열교환기(냉각핀) 분해 전·후',
  '시스템 1Way': '드레인팬 및 송풍팬 분해 전·후',
  '시스템 4Way': '내부 종합 분해 전·후',
  '세탁기': '세탁조(스텐튜브) 분해 전·후',
  '건조기': '콘덴서 및 팬 분해 전·후',
  '공기청정기': '필터 및 내부 분해 전·후',
  '제습기': '열교환기 분해 전·후',
  '냉장고': '냉각팬 및 내부 분해 전·후',
};

export const StandAirconBeforeAfter: React.FC<StandAirconBeforeAfterProps> = ({ onOpenBooking }) => {
  const { cmsData } = useCMS();
  const rawWorkCases = cmsData.beforeAfterCases;
  
  // Sort work cases by order field
  const workCases = [...rawWorkCases].sort((a, b) => (a.order || 0) - (b.order || 0));

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  // Category filter options
  const categoriesList = ['all', '벽걸이 에어컨', '스탠드 에어컨', '시스템 1Way', '시스템 4Way', '세탁기', '건조기', '공기청정기', '제습기', '냉장고'];

  const filteredCases = selectedCategory === 'all'
    ? workCases
    : workCases.filter(c => c.category === selectedCategory || c.title.includes(selectedCategory));

  const handleBookingClick = () => {
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      const element = document.getElementById('services');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomIndex === null) return;
      if (e.key === 'Escape') setZoomIndex(null);
      if (e.key === 'ArrowLeft') {
        setZoomIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredCases.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setZoomIndex((prev) => (prev !== null && prev < filteredCases.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIndex, filteredCases.length]);

  const activeZoomItem = zoomIndex !== null ? filteredCases[zoomIndex] : null;

  return (
    <section className="bg-slate-50/70 py-12 sm:py-16 md:py-20 rounded-[32px] border border-blue-100/80 shadow-xl shadow-blue-950/5 my-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% 현장 분해세척 실제 작업 비교</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            실제 작업 전·후 비교 <span className="text-blue-600">갤러리</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            전문 마스터가 직접 완전분해 세척한 100% 현장 부위별 비포&애프터 사진입니다.
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-2 scrollbar-none">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-blue-500/20 shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat === 'all' ? '전체 보기' : cat}
              </button>
            );
          })}
        </div>

        {/* 3-COLUMN RESPONSIVE HORIZONTAL CARD GRID */}
        {/* Mobile: 1 per row (grid-cols-1), Tablet: 2 per row (md:grid-cols-2), PC: 3 per row (lg:grid-cols-3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCases.map((item, idx) => {
            const defaultBulletPoints = item.afterPoints && item.afterPoints.length > 0
              ? item.afterPoints
              : ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거'];

            const specificPartLabel = item.altText?.includes('분해')
              ? item.altText
              : DEFAULT_PARTS[item.category] || '분해 세척 전·후';

            return (
              <div
                key={item.id}
                className="bg-white rounded-[24px] p-5 border border-gray-200/90 shadow-md shadow-blue-900/5 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* ① TOP - SERVICE NAME & SPECIFIC PART BADGE */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      {item.category}
                    </span>
                    <span className="text-xs font-extrabold text-blue-600/80 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {specificPartLabel}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* ② CENTER - BEFORE PHOTO (LEFT) & AFTER PHOTO (RIGHT) */}
                  <div
                    onClick={() => setZoomIndex(idx)}
                    className="relative p-2 bg-slate-50/80 rounded-2xl border border-gray-200/80 cursor-pointer overflow-hidden group/img transition-all hover:bg-blue-50/40"
                  >
                    <div className="grid grid-cols-2 gap-2 relative">
                      
                      {/* Left: 청소 전 사진 (BEFORE) */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-inner">
                        {item.beforeImage ? (
                          <img
                            src={item.beforeImage}
                            alt={`${item.title} 청소 전`}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gray-100 text-gray-400">
                            <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                            <span className="text-[10px] font-bold">실제 작업 사진</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 z-10 bg-rose-600/90 backdrop-blur-sm text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow flex items-center space-x-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>청소 전</span>
                        </span>
                      </div>

                      {/* Right: 청소 후 사진 (AFTER) */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-inner">
                        {item.afterImage ? (
                          <img
                            src={item.afterImage}
                            alt={`${item.title} 청소 후`}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-gray-100 text-gray-400">
                            <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                            <span className="text-[10px] font-bold">실제 작업 사진</span>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 z-10 bg-blue-600/90 backdrop-blur-sm text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow flex items-center space-x-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>청소 후</span>
                        </span>
                      </div>

                      {/* Center Divider Icon / Arrow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-blue-600 text-white shadow-xl rounded-full px-2.5 py-1 text-[10px] font-black border-2 border-white flex items-center space-x-1">
                        <span>BEFORE</span>
                        <ArrowRight className="w-3 h-3 text-amber-300" />
                        <span>AFTER</span>
                      </div>

                    </div>

                    {/* Zoom Hint Overlay */}
                    <div className="mt-2 text-center flex items-center justify-center space-x-1 text-xs text-blue-600 font-bold group-hover/img:underline">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>클릭하여 고화질 크게 보기 (Lightbox)</span>
                    </div>
                  </div>
                </div>

                {/* ③ BOTTOM - SIMPLE DESCRIPTION BULLETS & DIRECT BOOKING ACTION BUTTON */}
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                  {/* Bullet Tags: ✔ 곰팡이 제거 ✔ 고압세척 ✔ 살균 완료 ✔ 냄새 제거 */}
                  <div className="flex flex-wrap gap-1.5">
                    {defaultBulletPoints.map((pt, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center text-xs font-bold text-gray-800 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100/60"
                      >
                        <span className="text-blue-600 font-extrabold mr-1">✔</span>
                        <span>{pt.replace(/^✔\s*/, '')}</span>
                      </span>
                    ))}
                  </div>

                  {/* Clear Action Button: [이 서비스 예약하기] */}
                  <button
                    onClick={handleBookingClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/10 active:scale-[0.98] group/btn"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>이 상품 예약하기</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM GLOBAL BUTTON */}
        <div className="text-center pt-2">
          <button
            onClick={handleBookingClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-slate-900 hover:bg-blue-600 text-white font-black text-base sm:text-lg px-8 py-3.5 rounded-2xl transition-all shadow-xl active:scale-[0.98] group"
          >
            <CalendarCheck className="w-5 h-5 text-amber-400" />
            <span>원하는 서비스 견적 확인 및 바로 예약하기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-400" />
          </button>
        </div>

      </div>

      {/* LIGHTBOX ENLARGED MODAL */}
      {activeZoomItem && zoomIndex !== null && (
        <div
          onClick={() => setZoomIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-800 text-white"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full">
                  {activeZoomItem.category}
                </span>
                <h4 className="font-extrabold text-white text-base sm:text-lg">
                  {activeZoomItem.title}
                </h4>
              </div>
              <button
                onClick={() => setZoomIndex(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
                aria-label="닫기 (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Side-by-Side Photo View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-800 inline-block">
                  청소 전 (BEFORE)
                </span>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-800">
                  {activeZoomItem.beforeImage ? (
                    <img
                      src={activeZoomItem.beforeImage}
                      alt={`${activeZoomItem.title} 청소 전`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span>실제 현장 사진 업로드 준비중</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800 inline-block">
                  청소 후 (AFTER)
                </span>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-800">
                  {activeZoomItem.afterImage ? (
                    <img
                      src={activeZoomItem.afterImage}
                      alt={`${activeZoomItem.title} 청소 후`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span>실제 현장 사진 업로드 준비중</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Bullet Points & Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex flex-wrap gap-2">
                {(activeZoomItem.afterPoints || ['곰팡이 제거', '고압세척', '살균 완료', '냄새 제거']).map((pt, pIdx) => (
                  <span key={pIdx} className="text-xs font-bold text-blue-300 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-800/60">
                    ✔ {pt.replace(/^✔\s*/, '')}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  setZoomIndex(null);
                  handleBookingClick();
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 shrink-0"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>이 서비스 바로 예약하기</span>
              </button>
            </div>

            {/* Navigation Buttons (< >) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => setZoomIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredCases.length - 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl flex items-center space-x-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전 사례</span>
              </button>

              <span className="text-xs font-bold text-slate-400">
                {zoomIndex + 1} / {filteredCases.length}
              </span>

              <button
                onClick={() => setZoomIndex((prev) => (prev !== null && prev < filteredCases.length - 1 ? prev + 1 : 0))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl flex items-center space-x-1 transition-colors"
              >
                <span>다음 사례</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StandAirconBeforeAfter;
