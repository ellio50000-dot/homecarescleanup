import React, { useState } from 'react';
import { Phone, Calendar, Search, Users, ShieldCheck, Sparkles, Menu, X, Clock, ShieldAlert, Settings } from 'lucide-react';
import { PHONE_NUMBERS } from '../data/mockData';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenBooking: (applianceId?: string) => void;
  onOpenMyBookings: () => void;
  onOpenPartnerModal: () => void;
  onOpenAdminDashboard: () => void;
  onOpenSystemIntegration?: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenMyBookings,
  onOpenPartnerModal,
  onOpenAdminDashboard,
  onOpenSystemIntegration,
  activeSection,
  setActiveSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
      {/* Top Banner - Phone Numbers & CS Info */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-950 text-white text-xs py-2 px-4 border-b border-blue-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
              <span>전북 전지역 분해청소 출장</span>
            </span>
            <span className="hidden xl:inline-flex items-center space-x-1 text-slate-200 text-[11px] font-medium">
              <span>(전주·익산·군산·김제·정읍·남원 에어컨·세탁기·건조기·공기청정기·제습기·냉장고)</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 ml-auto font-semibold whitespace-nowrap">
            <a
              href={`tel:${PHONE_NUMBERS.representative.replace('-', '')}`}
              className="flex items-center hover:text-blue-200 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 mr-1 text-emerald-400" />
              <span className="whitespace-nowrap">대표번호 <strong className="text-white text-base ml-1 font-black">{PHONE_NUMBERS.representative}</strong></span>
            </a>
            <span className="text-blue-400/50">|</span>
            <a
              href={`tel:${PHONE_NUMBERS.reservation.replace('-', '')}`}
              className="flex items-center hover:text-blue-200 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 mr-1 text-amber-300 animate-pulse" />
              <span className="whitespace-nowrap">직통예약 <strong className="text-amber-200 text-base ml-1 font-black">{PHONE_NUMBERS.reservation}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <Logo showPhone={true} onClick={() => scrollTo('hero')} />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5 text-xs xl:text-sm font-bold text-gray-700 whitespace-nowrap">
          <button
            onClick={() => scrollTo('services')}
            className={`whitespace-nowrap hover:text-blue-600 transition-colors py-1 ${activeSection === 'services' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            가전 세척 안내
          </button>
          <button
            onClick={() => scrollTo('process')}
            className={`whitespace-nowrap hover:text-blue-600 transition-colors py-1 ${activeSection === 'process' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            6단계 세척 프로세스
          </button>
          <button
            onClick={() => scrollTo('reviews')}
            className={`whitespace-nowrap hover:text-blue-600 transition-colors py-1 ${activeSection === 'reviews' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            방문 고객 후기
          </button>
          <button
            onClick={() => scrollTo('diagnostic')}
            className={`whitespace-nowrap hover:text-blue-600 transition-colors py-1 ${activeSection === 'diagnostic' ? 'text-blue-600 font-extrabold border-b-2 border-blue-600' : ''}`}
          >
            셀프 상태 진단
          </button>
          <button
            onClick={onOpenPartnerModal}
            className="whitespace-nowrap flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-extrabold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span className="whitespace-nowrap">협력기사/교육생 모집</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-2 flex-shrink-0 whitespace-nowrap">
          <button
            onClick={onOpenMyBookings}
            className="whitespace-nowrap flex items-center space-x-1 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            <Search className="w-3.5 h-3.5 text-gray-500" />
            <span className="whitespace-nowrap">예약 조회</span>
          </button>

          <button
            onClick={() => onOpenBooking()}
            className="whitespace-nowrap flex items-center space-x-1.5 px-3.5 py-2 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/25 transition-all transform active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span className="whitespace-nowrap">실시간 예약하기</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1 py-2 text-sm font-semibold text-gray-800">
            <button
              onClick={() => scrollTo('services')}
              className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-800 hover:text-blue-600"
            >
              가전 세척 안내 (6대 가전)
            </button>
            <button
              onClick={() => scrollTo('process')}
              className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-800 hover:text-blue-600"
            >
              체계적인 6단계 분해세척 프로세스
            </button>
            <button
              onClick={() => scrollTo('reviews')}
              className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-800 hover:text-blue-600"
            >
              방문고객 실제 리뷰
            </button>
            <button
              onClick={() => scrollTo('diagnostic')}
              className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-800 hover:text-blue-600"
            >
              가전 오염도 상태진단
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPartnerModal();
              }}
              className="block w-full text-left px-3 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
            >
              🤝 협력기사 & 홈케어 교육생 수시모집 (수수료 75%+)
            </button>
          </div>

          <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyBookings();
              }}
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-gray-100 font-bold text-xs text-gray-700 rounded-xl"
            >
              <Search className="w-4 h-4" />
              <span>내 예약 조회</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>간편 실시간 예약</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
