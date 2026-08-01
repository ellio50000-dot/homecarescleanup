import React from 'react';
import { PHONE_NUMBERS } from '../data/mockData';
import { ShieldCheck, Phone, MapPin, Clock, ShieldAlert } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onOpenPartnerModal: () => void;
  onOpenBooking: () => void;
  onOpenAdminDashboard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPartnerModal, onOpenBooking, onOpenAdminDashboard }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-12 pb-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <Logo variant="dark" showPhone={true} size="md" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              대한민국 1등 가전 완전분해 정밀 세척 전문 브랜드 홈케어스 클린업.<br />
              에어컨, 세탁기, 건조기, 공기청정기, 제습기, 냉장고의 곰팡이와 유해 세균을 100% 살균 케어합니다.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>전북 가전 완전분해 세척 전문업체 (100% 무상 A/S 보증)</span>
            </div>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-extrabold text-white text-sm">고객센터 & 예약 문의</h4>
            <div className="space-y-1">
              <div className="text-base font-black text-white flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>대표번호: <strong className="text-white">{PHONE_NUMBERS.representative}</strong></span>
              </div>
              <div className="text-base font-black text-amber-300 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-300" />
                <span>직통예약: <strong>{PHONE_NUMBERS.reservation}</strong></span>
              </div>
              <p className="text-slate-400 text-[11px] pt-1">
                운영시간: {PHONE_NUMBERS.hours} (온라인 예약 24시간 접수 가능)
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-extrabold text-white text-sm">주요 서비스 링크</h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <button onClick={onOpenBooking} className="hover:text-blue-400 transition-colors">
                  • 6대 가전 실시간 간편 예약
                </button>
              </li>
              <li>
                <button onClick={onOpenPartnerModal} className="hover:text-emerald-400 transition-colors font-bold text-emerald-300">
                  • 🤝 협력기사 & 홈케어 교육생 수시모집 지원
                </button>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-400 transition-colors">
                  • 에어컨/세탁기 완전분해 가격표
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-blue-400 transition-colors">
                  • 방문 세척 실시간 고객 후기
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Business details footer */}
        <div className="space-y-2 text-[11px] text-slate-500">
          <p>
            (주)홈케어스클린업 | 대표이사: 홍길동 | 사업자등록번호: 123-86-09182 | 통신판매업신고: 제2026-서울서초-0192호
          </p>
          <p>
            주소: 서울특별시 서초구 반포대로 128 홈케어스 타워 4층 | 개인정보관리책임자: 김현수 | 대표 이메일: cs@homecares-cleanup.co.kr
          </p>
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-900/80 mt-2">
            <p className="text-slate-600">
              Copyright © HomeCares Cleanup. All Rights Reserved.
            </p>
            {onOpenAdminDashboard && (
              <button
                onClick={onOpenAdminDashboard}
                className="inline-flex items-center space-x-1 text-[10px] font-semibold text-slate-500 hover:text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded transition-all self-start sm:self-auto"
                title="관리자 모드 (오더 관리 & 기사 배정)"
              >
                <ShieldAlert className="w-3 h-3 text-slate-500" />
                <span>관리자 모드</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
