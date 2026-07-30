import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' for light backgrounds, 'dark' for dark backgrounds
  showPhone?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LogoIcon: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'w-10 h-10',
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${sizeClass} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic Blue Chrome Gradients */}
        <linearGradient id="chromeOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="25%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="75%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="chromeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="30%" stopColor="#3B82F6" />
          <stop offset="70%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>

        <linearGradient id="metalFacetDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#090D16" />
        </linearGradient>

        <linearGradient id="metalFacetLight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>

        {/* Water Sphere Glow & Color Gradients */}
        <radialGradient id="sphereAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#0284C7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="waterOrbBody" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="20%" stopColor="#7DD3FC" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="85%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </radialGradient>

        <linearGradient id="waterWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
        </linearGradient>

        {/* Outer Soft Drop Shadow */}
        <filter id="logoGlowShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0284C7" floodOpacity="0.3" />
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#logoGlowShadow)">
        {/* CHIMNEY ON RIGHT ROOF */}
        <polygon points="142,32 158,32 158,62 142,50" fill="url(#metalFacetDark)" />
        <polygon points="142,32 158,32 152,25 138,25" fill="url(#chromeHighlight)" />
        <polygon points="138,25 152,25 158,62 142,62" fill="url(#metalFacetLight)" opacity="0.8" />

        {/* METALLIC FACETED HOUSE FRAME */}
        {/* Outer Roof Gables */}
        <polygon points="100,16 182,78 166,92 100,42" fill="url(#chromeHighlight)" />
        <polygon points="100,16 18,78 34,92 100,42" fill="url(#metalFacetDark)" />

        {/* Roof Bevel Top Ridge */}
        <polygon points="100,16 100,42 100,42 100,16" stroke="url(#chromeHighlight)" strokeWidth="3" />

        {/* Outer Wall Pillars */}
        <polygon points="18,78 34,92 34,178 18,168" fill="url(#chromeOuter)" />
        <polygon points="182,78 166,92 166,178 182,168" fill="url(#metalFacetDark)" />

        {/* Bottom Threshold Base */}
        <polygon points="18,168 34,178 166,178 182,168" fill="url(#metalFacetDark)" />
        <polygon points="34,166 166,166 166,178 34,178" fill="url(#chromeHighlight)" opacity="0.6" />

        {/* Facet Detail Lines on Outer Frame */}
        <polygon points="100,16 182,78 182,168 166,178 166,92 100,42" fill="url(#chromeHighlight)" opacity="0.2" />
        <polygon points="100,16 18,78 18,168 34,178 34,92 100,42" fill="url(#metalFacetDark)" opacity="0.4" />

        {/* Inner Cutout House Opening */}
        <polygon points="100,52 154,92 154,164 46,164 46,92" fill="#091224" />

        {/* Inner Facet Chrome Border Frame */}
        <polygon points="100,52 154,92 144,98 100,66" fill="url(#chromeHighlight)" />
        <polygon points="100,52 46,92 56,98 100,66" fill="url(#metalFacetDark)" />
        <polygon points="46,92 56,98 56,156 46,164" fill="url(#metalFacetLight)" opacity="0.5" />
        <polygon points="154,92 144,98 144,156 154,164" fill="url(#chromeOuter)" />
        <polygon points="46,164 56,156 144,156 154,164" fill="url(#metalFacetDark)" />

        {/* GLOWING BLUE WATER SPHERE ORB */}
        {/* Glow Aura behind Orb */}
        <circle cx="100" cy="118" r="48" fill="url(#sphereAura)" />

        {/* Main Water Orb */}
        <circle cx="100" cy="118" r="36" fill="url(#waterOrbBody)" />

        {/* Internal Swirl Wave / Fluid Reflections inside Water Orb */}
        <path
          d="M 68,118 C 76,100 92,102 100,118 C 108,134 124,136 132,118 C 126,142 104,154 82,142 C 70,135 66,126 68,118 Z"
          fill="url(#waterWaveGrad)"
          opacity="0.85"
        />

        <path
          d="M 68,118 C 72,108 84,104 100,110 C 116,116 128,112 132,118 C 130,102 118,88 100,88 C 82,88 70,102 68,118 Z"
          fill="#FFFFFF"
          opacity="0.4"
        />

        {/* Specular Highlight Arc (Top Left Glare) */}
        <path
          d="M 76,98 A 28 28 0 0 1 120,94"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Secondary Bottom Reflection */}
        <path
          d="M 82,142 A 26 26 0 0 0 118,142"
          stroke="#7DD3FC"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Center Sparkle Accent */}
        <circle cx="86" cy="102" r="2.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'light',
  showPhone = false,
  className = '',
  onClick,
}) => {
  // Size classes mapping
  const iconSizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16',
    lg: 'w-18 h-18 sm:w-22 sm:h-22',
  };

  const titleSizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl lg:text-3xl',
    lg: 'text-2xl sm:text-3xl lg:text-4xl',
  };

  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-2.5 sm:space-x-3 select-none flex-shrink-0 ${
        onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''
      } ${className}`}
    >
      {/* 3D House & Appliances Metallic Blue Logo Icon */}
      <LogoIcon sizeClass={iconSizeClasses[size]} />

      {/* Typography matching business card styling */}
      <div className="flex flex-col justify-center whitespace-nowrap">
        <div className="flex items-center space-x-1.5">
          <span
            className={`font-black tracking-tight font-sans leading-none whitespace-nowrap ${titleSizeClasses[size]} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            홈케어스<span className={isDark ? 'text-emerald-400' : 'text-blue-600'}>클린업</span>
          </span>
        </div>

        {showPhone ? (
          <div className="flex items-center space-x-1 mt-1 whitespace-nowrap">
            <span className={`text-xs sm:text-sm font-extrabold tracking-tight whitespace-nowrap ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
              대표전화 <strong className="font-black text-amber-700 dark:text-amber-300 text-sm sm:text-base lg:text-lg ml-0.5 whitespace-nowrap">1577-7931</strong>
            </span>
          </div>
        ) : (
          <p className={`text-xs sm:text-sm font-semibold mt-0.5 whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            가전 완전분해 정밀 살균 전문
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;
