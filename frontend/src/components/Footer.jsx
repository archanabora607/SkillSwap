import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[#7A2E44] bg-[#5B2333] text-[#F4B6A6]/90 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Logo size="sm" showText={true} textColor="white" />
          <span className="text-[#FFF8F3]/70 hidden md:inline">— Peer-to-peer student skill exchange network</span>
        </div>
        <div className="flex items-center space-x-1 text-[#FFF8F3]/80 font-medium">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-[#F4B6A6] fill-[#F4B6A6] inline mx-0.5" />
          <span>for collaborative student learning</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
