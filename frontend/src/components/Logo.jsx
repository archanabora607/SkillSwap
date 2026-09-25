import React from 'react';

const Logo = ({ size = 'md', showText = true, textColor = 'dark' }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center space-x-2.5 group select-none">
      {/* 3D Depth Logo Icon Container */}
      <div className={`relative ${currentSize.icon} rounded-xl bg-gradient-to-br from-[#5B2333] via-[#7A2E44] to-[#C86B7B] p-1 shadow-[0_6px_16px_rgba(91,35,51,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] group-hover:shadow-[0_8px_20px_rgba(200,107,123,0.4)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center`}>
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full text-[#FFF8F3] drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Page */}
          <path d="M 12,28 C 18,24 26,24 32,27 L 32,50 C 26,47 18,47 12,51 Z" fill="#FFF8F3" fillOpacity="0.85" />
          {/* Right Page */}
          <path d="M 52,28 C 46,24 38,24 32,27 L 32,50 C 38,47 46,47 52,51 Z" fill="#FFF8F3" fillOpacity="0.95" />
          {/* Flowing Pathway 1 (Burgundy to Rose Arrow) */}
          <path d="M 17,37 C 22,25 28,17 37,11 C 39,9.5 41,11.5 39,13.5 C 33,21 25,28 19,39 Z" fill="#F4B6A6" />
          {/* Flowing Pathway 2 (Rose Arrow) */}
          <path d="M 47,37 C 42,27 36,19 27,13 C 25,11.5 23,13.5 25,15.5 C 31,21 37,29 43,39 Z" fill="#FFF8F3" />
          {/* Sparkle Star */}
          <path d="M 44,7 L 45.5,11 L 49.5,12.5 L 45.5,14 L 44,18 L 42.5,14 L 38.5,12.5 L 42.5,11 Z" fill="#F4B6A6" />
          <circle cx="44" cy="12.5" r="1.2" fill="#FFF8F3" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center">
          <span className={`font-black tracking-tight ${currentSize.text} ${textColor === 'white' ? 'text-white' : 'text-[#29201D]'} group-hover:text-[#5B2333] transition-colors font-['Outfit']`}>
            Know<span className="bg-gradient-to-r from-[#C86B7B] via-[#C86B7B] to-[#F4B6A6] bg-clip-text text-transparent">via</span>
          </span>
          <span className={`hidden sm:inline-block ml-2 font-bold uppercase rounded-full bg-[#5B2333]/10 text-[#5B2333] border border-[#5B2333]/20 ${currentSize.badge}`}>
            Peer Learn
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
