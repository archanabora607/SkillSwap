import React from 'react';

const categoryColors = {
  Programming: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  'Web Development': 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  'Mobile Development': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  'Data Science & AI': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  Design: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
  'DevOps & Cloud': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Cybersecurity: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  Other: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
};

const SkillBadge = ({ skill, type = 'teach', level, onRemove }) => {
  const isTeach = type === 'teach';
  const name = typeof skill === 'string' ? skill : skill.name;
  const category = typeof skill === 'object' ? skill.category : 'Other';
  const colorClass = categoryColors[category] || categoryColors.Other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
        isTeach
          ? `${colorClass} shadow-xs`
          : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse"></span>
      {name}
      {level && (
        <span className="ml-1 opacity-70 text-[10px] font-normal uppercase tracking-wider">
          • {level}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 text-gray-400 hover:text-red-400 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
