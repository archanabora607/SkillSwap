import React from 'react';

const categoryColors = {
  Programming: 'bg-[#5B2333]/10 text-[#5B2333] border-[#5B2333]/30',
  'Web Development': 'bg-[#C86B7B]/15 text-[#9E3E4E] border-[#C86B7B]/30',
  'Mobile Development': 'bg-emerald-600/10 text-emerald-800 border-emerald-600/30',
  'Data Science & AI': 'bg-purple-600/10 text-purple-900 border-purple-600/30',
  Design: 'bg-[#F4B6A6]/30 text-[#5B2333] border-[#F4B6A6]/60',
  'DevOps & Cloud': 'bg-amber-600/10 text-amber-900 border-amber-600/30',
  Cybersecurity: 'bg-rose-600/10 text-rose-900 border-rose-600/30',
  Other: 'bg-[#29201D]/10 text-[#29201D] border-[#29201D]/20',
};

const SkillBadge = ({ skill, type = 'teach', level, onRemove }) => {
  const isTeach = type === 'teach';
  const name = typeof skill === 'string' ? skill : skill.name;
  const category = typeof skill === 'object' ? skill.category : 'Other';
  const colorClass = categoryColors[category] || categoryColors.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isTeach
          ? `${colorClass} shadow-xs`
          : 'bg-[#C86B7B]/10 text-[#5B2333] border-[#C86B7B]/30'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse"></span>
      {name}
      {level && (
        <span className="ml-1 opacity-75 text-[10px] font-bold uppercase tracking-wider">
          • {level}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 text-[#5B2333]/60 hover:text-rose-700 focus:outline-none cursor-pointer"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
