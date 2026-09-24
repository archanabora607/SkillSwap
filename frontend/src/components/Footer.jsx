import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-800/60 bg-gray-950/80 text-gray-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">SkillSwap</span>
          <span>— Peer-to-peer student skill exchange network</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" />
          <span>for collaborative learning</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
