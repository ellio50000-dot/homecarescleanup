import React, { useState } from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Layers, RefreshCw, ZoomIn } from 'lucide-react';

// ==========================================
// 1. LG WHISEN TOWER DISASSEMBLY DIAGRAM
// ==========================================
export const LgWhisenDisassemblyDiagram: React.FC<{ isBefore: boolean }> = ({ isBefore }) => {
  return (
    <svg viewBox="0 0 900 500" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Background Radial Glow */}
        <radialGradient id="lgBgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isBefore ? '#450A0A' : '#064E3B'} stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0B132B" stopOpacity="0.9" />
        </radialGradient>

        {/* Metal Tower Body Gradient */}
        <linearGradient id="towerBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="30%" stopColor="#64748B" />
          <stop offset="70%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Aluminum Heat Exchanger Fins */}
        <pattern id="heatExchangerPattern" width="6" height="12" patternUnits="userSpaceOnUse">
          <line x1="1" y1="0" x2="1" y2="12" stroke={isBefore ? '#574229' : '#94A3B8'} strokeWidth="1.5" />
          <line x1="4" y1="0" x2="4" y2="12" stroke={isBefore ? '#3D2A18' : '#CBD5E1'} strokeWidth="1.5" />
        </pattern>

        {/* Fan Blade Metallic Gradient */}
        <radialGradient id="fanBladeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isBefore ? '#29180E' : '#E0F2FE'} />
          <stop offset="60%" stopColor={isBefore ? '#1A0F08' : '#38BDF8'} />
          <stop offset="100%" stopColor={isBefore ? '#0D0704' : '#0284C7'} />
        </radialGradient>

        {/* Mold Spots Pattern (For Before state) */}
        <radialGradient id="moldSpot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111827" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#374151" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#052e16" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dark Studio Background */}
      <rect width="900" height="500" fill="url(#lgBgGlow)" />
      <grid width="900" height="500" />

      {/* Floor Grid Stand Line */}
      <ellipse cx="450" cy="460" rx="380" ry="25" fill="#000000" opacity="0.6" />

      {/* ------------------------------------------- */}
      {/* LEFT: DISASSEMBLED TOWER CHASSIS (BODY) */}
      {/* ------------------------------------------- */}
      <g transform="translate(180, 30)">
        {/* Main Whisen Tower Outer Frame (Disassembled interior showing) */}
        <rect x="80" y="20" width="160" height="400" rx="24" fill="url(#towerBodyGrad)" stroke="#64748B" strokeWidth="4" />
        {/* Interior Cavity (Open Front Panel) */}
        <rect x="92" y="32" width="136" height="376" rx="16" fill="#090D16" stroke="#334155" strokeWidth="2" />

        {/* Heat Exchanger Coil Fins (Background inside) */}
        <rect x="100" y="44" width="120" height="352" rx="8" fill="url(#heatExchangerPattern)" />

        {/* BEFORE MOLD OVERLAY ON FINS */}
        {isBefore && (
          <g opacity="0.85">
            <ellipse cx="140" cy="90" rx="35" ry="25" fill="url(#moldSpot)" />
            <ellipse cx="170" cy="140" rx="25" ry="35" fill="url(#moldSpot)" />
            <ellipse cx="130" cy="230" rx="40" ry="30" fill="url(#moldSpot)" />
            <ellipse cx="165" cy="310" rx="30" ry="25" fill="url(#moldSpot)" />
            <ellipse cx="125" cy="360" rx="35" ry="20" fill="url(#moldSpot)" />
            {/* Dirty Mold Spots text tag */}
            <rect x="105" y="180" width="110" height="22" rx="4" fill="#7F1D1D" opacity="0.9" />
            <text x="160" y="195" fill="#FCA5A5" fontSize="11" fontWeight="bold" textAnchor="middle">
              ⚠️ 곰팡이/유해균 99.9%
            </text>
          </g>
        )}

        {/* AFTER CLEAN HIGH-GLOSS OVERLAY ON FINS */}
        {!isBefore && (
          <g opacity="0.9">
            <rect x="100" y="44" width="120" height="352" rx="8" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="6 4" />
            {/* Sparkles */}
            <circle cx="120" cy="80" r="3" fill="#FFFFFF" />
            <circle cx="190" cy="150" r="4" fill="#E0F2FE" />
            <circle cx="130" cy="280" r="3" fill="#FFFFFF" />
            <rect x="105" y="180" width="110" height="22" rx="4" fill="#065F46" opacity="0.9" />
            <text x="160" y="195" fill="#A7F3D0" fontSize="11" fontWeight="bold" textAnchor="middle">
              ✨ 150bar 고압 살균
            </text>
          </g>
        )}

        {/* TOP CIRCULAR BLOWER FAN ASSEMBLY */}
        <g transform="translate(160, 110)">
          <circle cx="0" cy="0" r="48" fill="#1E293B" stroke={isBefore ? '#7F1D1D' : '#0284C7'} strokeWidth="4" />
          {/* Fan Blades (4 blades) */}
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(0)" />
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(90)" />
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(180)" />
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(270)" />
          <circle cx="0" cy="0" r="14" fill={isBefore ? '#450A0A' : '#0F172A'} stroke={isBefore ? '#DC2626' : '#38BDF8'} strokeWidth="2" />
        </g>

        {/* BOTTOM CIRCULAR BLOWER FAN ASSEMBLY */}
        <g transform="translate(160, 270)">
          <circle cx="0" cy="0" r="48" fill="#1E293B" stroke={isBefore ? '#7F1D1D' : '#0284C7'} strokeWidth="4" />
          {/* Fan Blades */}
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(45)" />
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(135)" />
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(225)" />
          <path d="M 0 0 M -35 -10 C -10 -35 10 -35 35 -10 C 20 10 -20 10 -35 -10 Z" fill="url(#fanBladeGrad)" transform="rotate(315)" />
          <circle cx="0" cy="0" r="14" fill={isBefore ? '#450A0A' : '#0F172A'} stroke={isBefore ? '#DC2626' : '#38BDF8'} strokeWidth="2" />
        </g>

        {/* DRAIN CONDENSATE TRAY AT BOTTOM */}
        <rect x="96" y="370" width="128" height="28" rx="6" fill={isBefore ? '#3B200B' : '#E2E8F0'} stroke={isBefore ? '#78350F' : '#94A3B8'} strokeWidth="2" />
        <text x="160" y="388" fill={isBefore ? '#FDBA74' : '#0F172A'} fontSize="10" fontWeight="bold" textAnchor="middle">
          {isBefore ? '⚠️ 물받이 드레인 이끼/슬러지' : '✨ 드레인 100% 살균 완료'}
        </text>
      </g>

      {/* ------------------------------------------- */}
      {/* RIGHT: REMOVED FRONT PANEL (EXPLODED VIEW) */}
      {/* ------------------------------------------- */}
      <g transform="translate(490, 45)">
        {/* Exploded Connecting Lines */}
        <line x1="-30" y1="80" x2="30" y2="80" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="-30" y1="240" x2="30" y2="240" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="-30" y1="360" x2="30" y2="360" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />

        {/* Detached Front Cover Panel */}
        <rect x="30" y="10" width="150" height="390" rx="20" fill="url(#towerBodyGrad)" stroke="#94A3B8" strokeWidth="3" opacity="0.95" />

        {/* Twin Whisen Air Outlets Circles */}
        <circle cx="105" cy="95" r="42" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
        <circle cx="105" cy="95" r="28" fill="none" stroke="#0284C7" strokeWidth="2" />

        <circle cx="105" cy="255" r="42" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
        <circle cx="105" cy="255" r="28" fill="none" stroke="#0284C7" strokeWidth="2" />

        {/* LG Whisen Tower Brand Logo Badge */}
        <rect x="65" y="360" width="80" height="18" rx="4" fill="#000000" />
        <text x="105" y="373" fill="#FFFFFF" fontSize="10" fontWeight="black" textAnchor="middle" letterSpacing="1">
          LG WHISEN
        </text>
      </g>

      {/* ------------------------------------------- */}
      {/* LABELS & CALLOUT ANNOTATIONS */}
      {/* ------------------------------------------- */}
      {/* Callout 1: Dual Fan */}
      <g transform="translate(60, 110)">
        <rect x="0" y="0" width="190" height="36" rx="8" fill={isBefore ? '#7F1D1D' : '#065F46'} stroke={isBefore ? '#EF4444' : '#10B981'} strokeWidth="1.5" />
        <text x="12" y="16" fill="#FFFFFF" fontSize="11" fontWeight="bold">① 듀얼 송풍팬 (Blower Fan)</text>
        <text x="12" y="29" fill={isBefore ? '#FCA5A5' : '#A7F3D0'} fontSize="10">
          {isBefore ? '팬 날개 안쪽 곰팡이 착색' : '세척 후 날개 백색 살균'}
        </text>
        <path d="M 190 18 L 280 30" stroke={isBefore ? '#EF4444' : '#10B981'} strokeWidth="2" strokeDasharray="3 3" />
      </g>

      {/* Callout 2: Evaporator */}
      <g transform="translate(60, 270)">
        <rect x="0" y="0" width="190" height="36" rx="8" fill={isBefore ? '#7F1D1D' : '#065F46'} stroke={isBefore ? '#EF4444' : '#10B981'} strokeWidth="1.5" />
        <text x="12" y="16" fill="#FFFFFF" fontSize="11" fontWeight="bold">② 열교환기 냉각핀 (Fins)</text>
        <text x="12" y="29" fill={isBefore ? '#FCA5A5' : '#A7F3D0'} fontSize="10">
          {isBefore ? '흡입막힘 & 악취 유발 원인' : '140℃ 스팀으로 악취 제거'}
        </text>
        <path d="M 190 18 L 280 30" stroke={isBefore ? '#EF4444' : '#10B981'} strokeWidth="2" strokeDasharray="3 3" />
      </g>

      {/* Title Header Badge inside Diagram */}
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="260" height="32" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        <text x="15" y="21" fill="#F8FAFC" fontSize="12" fontWeight="black">
          LG 휘센 타워 스탠드 [분해 세척 {isBefore ? '전 ⚠️' : '후 ✨'}]
        </text>
      </g>
    </svg>
  );
};

// ==========================================
// 2. SAMSUNG BESPOKE 3-CIRCULATOR STAND DIAGRAM
// ==========================================
export const SamsungBespokeDisassemblyDiagram: React.FC<{ isBefore: boolean }> = ({ isBefore }) => {
  return (
    <svg viewBox="0 0 900 500" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="samsungBgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isBefore ? '#450A0A' : '#1E3A8A'} stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0B132B" stopOpacity="0.9" />
        </radialGradient>

        <linearGradient id="bespokeBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <pattern id="microHolePattern" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill={isBefore ? '#7F1D1D' : '#38BDF8'} opacity="0.6" />
        </pattern>
      </defs>

      <rect width="900" height="500" fill="url(#samsungBgGlow)" />

      {/* Main Tower Body */}
      <g transform="translate(350, 25)">
        <rect x="0" y="0" width="200" height="420" rx="30" fill="url(#bespokeBody)" stroke="#3B82F6" strokeWidth="3" />

        {/* 3 Circulator Vent Holes (Top, Mid, Bottom) */}
        {/* Top Vent */}
        <circle cx="100" cy="80" r="42" fill="#090D16" stroke={isBefore ? '#991B1B' : '#0284C7'} strokeWidth="4" />
        <circle cx="100" cy="80" r="32" fill="none" stroke={isBefore ? '#7F1D1D' : '#38BDF8'} strokeWidth="2" strokeDasharray="5 3" />
        <circle cx="100" cy="80" r="10" fill={isBefore ? '#450A0A' : '#E0F2FE'} />

        {/* Mid Vent */}
        <circle cx="100" cy="210" r="42" fill="#090D16" stroke={isBefore ? '#991B1B' : '#0284C7'} strokeWidth="4" />
        <circle cx="100" cy="210" r="32" fill="none" stroke={isBefore ? '#7F1D1D' : '#38BDF8'} strokeWidth="2" strokeDasharray="5 3" />
        <circle cx="100" cy="210" r="10" fill={isBefore ? '#450A0A' : '#E0F2FE'} />

        {/* Bottom Vent */}
        <circle cx="100" cy="340" r="42" fill="#090D16" stroke={isBefore ? '#991B1B' : '#0284C7'} strokeWidth="4" />
        <circle cx="100" cy="340" r="32" fill="none" stroke={isBefore ? '#7F1D1D' : '#38BDF8'} strokeWidth="2" strokeDasharray="5 3" />
        <circle cx="100" cy="340" r="10" fill={isBefore ? '#450A0A' : '#E0F2FE'} />

        {/* Samsung BESPOKE Logo */}
        <rect x="55" y="392" width="90" height="16" rx="4" fill="#000000" />
        <text x="100" y="404" fill="#60A5FA" fontSize="9" fontWeight="bold" textAnchor="middle">
          BESPOKE Q9000
        </text>
      </g>

      {/* Detached Microhole Front Panel */}
      <g transform="translate(600, 35)">
        <rect x="0" y="0" width="160" height="400" rx="20" fill="url(#microHolePattern)" stroke="#64748B" strokeWidth="2" />
        <text x="80" y="200" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
          무풍 마이크로홀 패널
        </text>
        <text x="80" y="220" fill={isBefore ? '#FCA5A5' : '#6EE7B7'} fontSize="10" textAnchor="middle">
          {isBefore ? '(미세 홀 입구 곰팡이 착색)' : '(백플러싱 관통 살균)'}
        </text>
      </g>

      {/* Callouts */}
      <g transform="translate(50, 150)">
        <rect x="0" y="0" width="240" height="60" rx="10" fill={isBefore ? '#7F1D1D' : '#065F46'} stroke={isBefore ? '#EF4444' : '#10B981'} strokeWidth="2" />
        <text x="15" y="24" fill="#FFFFFF" fontSize="12" fontWeight="bold">삼성 3구 무풍 서큘레이터</text>
        <text x="15" y="44" fill={isBefore ? '#FCA5A5' : '#A7F3D0'} fontSize="11">
          {isBefore ? '3개 원형 팬 하우징 찌든때 누적' : '3개 모듈 분리 후 고압 정밀 세척'}
        </text>
      </g>

      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="280" height="32" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        <text x="15" y="21" fill="#F8FAFC" fontSize="12" fontWeight="black">
          삼성 비스포크 Q9000 [무풍 분해 {isBefore ? '전 ⚠️' : '후 ✨'}]
        </text>
      </g>
    </svg>
  );
};

// ==========================================
// 3. BLOWER FAN & HEAT EXCHANGER CLOSE-UP DIAGRAM
// ==========================================
export const StandFanDetailDiagram: React.FC<{ isBefore: boolean }> = ({ isBefore }) => {
  return (
    <svg viewBox="0 0 900 500" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="500" fill="#090D16" />

      {/* Enlarged Blower Fan Cylinder */}
      <g transform="translate(150, 80)">
        <circle cx="180" cy="170" r="140" fill="#1E293B" stroke={isBefore ? '#991B1B' : '#0284C7'} strokeWidth="6" />

        {/* Multi-blade turbine fins */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <line
            key={i}
            x1="180"
            y1="170"
            x2={180 + 130 * Math.cos((angle * Math.PI) / 180)}
            y2={170 + 130 * Math.sin((angle * Math.PI) / 180)}
            stroke={isBefore ? '#7F1D1D' : '#38BDF8'}
            strokeWidth="5"
          />
        ))}

        <circle cx="180" cy="170" r="40" fill={isBefore ? '#450A0A' : '#E0F2FE'} />

        {/* Dirty Mold Spots overlay */}
        {isBefore && (
          <g opacity="0.9">
            <circle cx="140" cy="120" r="18" fill="#450A0A" stroke="#EF4444" strokeWidth="2" />
            <circle cx="220" cy="190" r="22" fill="#450A0A" stroke="#EF4444" strokeWidth="2" />
            <circle cx="160" cy="230" r="16" fill="#450A0A" opacity="0.8" />
          </g>
        )}
      </g>

      {/* Explanatory Callout Box */}
      <g transform="translate(520, 120)">
        <rect x="0" y="0" width="320" height="240" rx="16" fill={isBefore ? '#450A0A' : '#064E3B'} stroke={isBefore ? '#DC2626' : '#10B981'} strokeWidth="2" />
        <text x="20" y="40" fill="#FFFFFF" fontSize="16" fontWeight="black">
          {isBefore ? '⚠️ 분해 전: 송풍팬 안쪽 곰팡이' : '✨ 분해 후: 신품 수준 살균완료'}
        </text>
        <text x="20" y="80" fill={isBefore ? '#FCA5A5' : '#A7F3D0'} fontSize="13">
          {isBefore ? '• 송풍팬 날개 안쪽 회색/검은 곰팡이 흡착' : '• 150bar 초고압수로 묵은 때 100% 세척'}
        </text>
        <text x="20" y="110" fill={isBefore ? '#FCA5A5' : '#A7F3D0'} fontSize="13">
          {isBefore ? '• 에어컨 가동 시 시큼한 걸레 냄새 유발' : '• 140℃ 스팀으로 유해세균 및 악취 제거'}
        </text>
        <text x="20" y="140" fill={isBefore ? '#FCA5A5' : '#A7F3D0'} fontSize="13">
          {isBefore ? '• 호흡기 비염 및 아토피 유발 원인포자' : '• 친환경 피톤치드 코팅 소독 완료'}
        </text>
      </g>
    </svg>
  );
};

// ==========================================
// MAIN STAND AIRCON BEFORE & AFTER COMPONENT
// ==========================================
export const StandAirconBeforeAfter: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('lg-whisen-stand');
  const [viewMode, setViewMode] = useState<'before' | 'after' | 'split'>('before');

  const currentItem = [
    {
      id: 'lg-whisen-stand',
      modelName: 'LG 휘센 타워/듀얼 스탠드 에어컨',
      brand: 'LG',
      beforeTitle: 'LG 휘센 스탠드 완전분해 - 듀얼 송풍팬/드레인 곰팡이',
      beforeDesc: '전면 패널 탈거 후 듀얼 송풍팬 및 물받이 드레인에 검은색 누적 곰팡이와 비염 원인 유해세균 서식',
      afterTitle: 'LG 휘센 스탠드 150bar 고압수 세척 & 140℃ 스팀 소독 완료',
      afterDesc: '듀얼 팬과 드레인판 100% 완전 분해 고압 세척으로 맑고 깨끗한 숲속 바람 복원',
      parts: [
        { name: '듀얼 송풍팬 (Blower Fan)', beforeStatus: '검은 곰팡이 덩어리 & 먼지 고착', afterStatus: '투명 정밀 세척 100% 살균' },
        { name: '열교환기 냉각핀 (Evaporator)', beforeStatus: '찌든 먼지 및 시큼한 냄새 발산', afterStatus: '은색 알루미늄 핀 반짝임 복원' },
        { name: '드레인 물받이 (Drain Pan)', beforeStatus: '갈색 이끼 물때 슬러지 축적', afterStatus: '하얀 순정 상태 완벽 세척' },
      ],
    },
    {
      id: 'samsung-bespoke-stand',
      modelName: '삼성 비스포크 Q9000 무풍 스탠드 에어컨',
      brand: 'Samsung',
      beforeTitle: '삼성 비스포크 무풍 스탠드 - 마이크로홀 & 3구 팬 하우징 오염',
      beforeDesc: '무풍 홀 내부 습기로 인한 검은 곰팡이 점 착색 및 3구 서큘레이터 팬 가스켓 찌꺼기',
      afterTitle: '삼성 비스포크 무풍 홀 백플러싱 & UV 피톤치드 코팅 완료',
      afterDesc: '3구 팬 모듈 분해 후 친환경 세제 고압수 직사로 미세 곰팡이 포자까지 99.9% 멸균',
      parts: [
        { name: '무풍 패널 마이크로홀', beforeStatus: '홀 입구 곰팡이 포자 번식', afterStatus: '초고압 고온스팀 완전 관통 세척' },
        { name: '3구 서큘레이터 송풍모듈', beforeStatus: '회전 날개 묵은 먼지 덩어리', afterStatus: '모듈 분리 멸균 소독' },
        { name: '하부 토출구 가림판', beforeStatus: '습기 응결 곰팡이 착색', afterStatus: '피톤치드 항균 코팅 완성' },
      ],
    },
    {
      id: 'stand-fan-detail',
      modelName: '송풍팬 & 열교환기 정밀 확대 비교',
      brand: 'Common',
      beforeTitle: '스탠드 에어컨 송풍팬 고압 세척 전 (곰팡이 99.9%)',
      beforeDesc: '에어컨 틀었을 때 쉰내와 기침을 유발하는 송풍팬 날개 안쪽 곰팡이 흡착 상태',
      afterTitle: '스탠드 에어컨 송풍팬 고압 세척 후 (신품 수준 살균)',
      afterDesc: '친환경 전용 세제로 묵은 때를 불린 후 150bar 고압수로 박멸한 청결 상태',
      parts: [
        { name: '송풍팬 안쪽 블레이드', beforeStatus: '곰팡이 솜털 및 먼지 점착', afterStatus: '매끈한 원래 표면 복원' },
        { name: '알루미늄 열교환기(핀)', beforeStatus: '공기 흡입막힘 & 냉방 저하', afterStatus: '열교환 효율 30% 향상' },
      ],
    },
  ].find((item) => item.id === selectedModelId)!;

  const renderDiagram = (isBefore: boolean) => {
    if (selectedModelId === 'lg-whisen-stand') {
      return <LgWhisenDisassemblyDiagram isBefore={isBefore} />;
    } else if (selectedModelId === 'samsung-bespoke-stand') {
      return <SamsungBespokeDisassemblyDiagram isBefore={isBefore} />;
    } else {
      return <StandFanDetailDiagram isBefore={isBefore} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600/30 text-blue-400 border border-blue-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>실제 분해 세척 현장 정밀 검증</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">LG 휘센 타워 / 삼성 비스포크 분해 도면</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white mt-1">
            스탠드 에어컨 완전분해 세척 전/후 비교
          </h3>
        </div>

        {/* View Mode Switcher (Before / After / Split Side-by-Side) */}
        <div className="bg-slate-800 p-1.5 rounded-xl flex space-x-1 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('before')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition-all flex items-center space-x-1 ${
              viewMode === 'before'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 ring-2 ring-red-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>세척 전</span>
          </button>

          <button
            onClick={() => setViewMode('after')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition-all flex items-center space-x-1 ${
              viewMode === 'after'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>세척 후</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg font-extrabold transition-all flex items-center space-x-1 ${
              viewMode === 'split'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 ring-2 ring-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-200" />
            <span>나란히 비교</span>
          </button>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={() => setSelectedModelId('lg-whisen-stand')}
          className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex items-center justify-between ${
            selectedModelId === 'lg-whisen-stand'
              ? 'bg-gradient-to-r from-rose-950/80 to-slate-900 border-rose-500 text-white shadow-md ring-1 ring-rose-400'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 mr-2">
              LG Whisen
            </span>
            <div className="text-sm font-extrabold text-white mt-0.5">LG 휘센 타워 스탠드</div>
          </div>
          {selectedModelId === 'lg-whisen-stand' && <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />}
        </button>

        <button
          onClick={() => setSelectedModelId('samsung-bespoke-stand')}
          className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex items-center justify-between ${
            selectedModelId === 'samsung-bespoke-stand'
              ? 'bg-gradient-to-r from-blue-950/80 to-slate-900 border-blue-500 text-white shadow-md ring-1 ring-blue-400'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800 mr-2">
              Samsung
            </span>
            <div className="text-sm font-extrabold text-white mt-0.5">삼성 비스포크 Q9000</div>
          </div>
          {selectedModelId === 'samsung-bespoke-stand' && <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />}
        </button>

        <button
          onClick={() => setSelectedModelId('stand-fan-detail')}
          className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex items-center justify-between ${
            selectedModelId === 'stand-fan-detail'
              ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-500 text-white shadow-md ring-1 ring-indigo-400'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 mr-2">
              정밀 확대
            </span>
            <div className="text-sm font-extrabold text-white mt-0.5">송풍팬 & 냉각핀 확대</div>
          </div>
          {selectedModelId === 'stand-fan-detail' && <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />}
        </button>
      </div>

      {/* Main Visual Display Area */}
      {viewMode === 'split' ? (
        /* Side-By-Side Split View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-red-400">
              <ShieldAlert className="w-4 h-4" />
              <span>[분해 직후] 세척 전 곰팡이 서식 상태</span>
            </div>
            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-red-900/60 bg-slate-950 p-2 shadow-inner">
              {renderDiagram(true)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>[고압세척 후] 100% 완벽 살균 소독 상태</span>
            </div>
            <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-emerald-900/60 bg-slate-950 p-2 shadow-inner">
              {renderDiagram(false)}
            </div>
          </div>
        </div>
      ) : (
        /* Single View Mode (Before or After) */
        <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-2 sm:p-4 shadow-inner">
          {renderDiagram(viewMode === 'before')}

          {/* Bottom Banner Note */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto max-w-xl">
            <div
              className={`p-3 rounded-xl backdrop-blur-md border shadow-lg ${
                viewMode === 'before'
                  ? 'bg-red-950/90 border-red-500/60 text-red-100'
                  : 'bg-emerald-950/90 border-emerald-500/60 text-emerald-100'
              }`}
            >
              <div className="flex items-center space-x-2 font-black text-xs sm:text-sm">
                {viewMode === 'before' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>[분해 직후 현장] {currentItem.beforeTitle}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>[살균 세척 완수] {currentItem.afterTitle}</span>
                  </>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                {viewMode === 'before' ? currentItem.beforeDesc : currentItem.afterDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disassembled Parts Breakdown Table */}
      <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>{currentItem.modelName} 부품별 세척 정밀 비교</span>
          </span>
          <span className="text-[10px] text-slate-500">* 100% 완전 분해 세척 보증</span>
        </div>

        <div className="grid grid-cols-1 divide-y divide-slate-800 text-xs">
          {currentItem.parts.map((part, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
              <span className="font-bold text-slate-200 min-w-[140px]">{part.name}</span>
              <div className="flex items-center space-x-2 text-right">
                <span className="text-red-400/90 font-medium line-through text-[11px] hidden sm:inline">
                  {part.beforeStatus}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600 hidden sm:inline" />
                <span className="text-emerald-400 font-extrabold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/50">
                  {part.afterStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandAirconBeforeAfter;

