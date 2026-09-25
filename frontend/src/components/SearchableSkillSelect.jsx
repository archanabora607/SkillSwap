import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { DEFAULT_SKILLS } from '../constants/skills';

const SearchableSkillSelect = ({
  skills = [],
  selectedSkillId = '',
  onSelectSkill,
  placeholder = 'Search & select a skill...',
  type = 'teach',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);

  const activeSkills = skills && skills.length > 0 ? skills : DEFAULT_SKILLS;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedSkill = activeSkills.find((s) => (s._id || s.id) === selectedSkillId);

  const filteredSkills = activeSkills.filter((s) =>
    (s.name || '').toLowerCase().includes(query.toLowerCase()) ||
    (s.category || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input Box */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full px-3.5 py-2.5 rounded-xl glass-input flex items-center justify-between cursor-pointer focus-within:border-[#C86B7B]"
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0 pr-2">
          <Search className="w-3.5 h-3.5 text-[#C86B7B] flex-shrink-0" />
          <input
            type="text"
            value={isOpen ? query : selectedSkill ? selectedSkill.name : ''}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs text-[#29201D] placeholder-[#A08C85] focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          {selectedSkill && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectSkill('');
                setQuery('');
              }}
              className="p-0.5 rounded-md hover:bg-[#F4B6A6]/30 text-[#5B2333] hover:text-[#C86B7B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-[#5B2333]/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white rounded-2xl border border-[#F2E5DC] shadow-2xl z-50 py-1 divide-y divide-[#F2E5DC] animate-in fade-in duration-150">
          {filteredSkills.length === 0 ? (
            <div className="px-4 py-3 text-center text-xs text-[#8C7770]">
              No skills found matching "{query}"
            </div>
          ) : (
            filteredSkills.map((sk) => {
              const skId = sk._id || sk.id;
              const isSelected = skId === selectedSkillId;
              return (
                <div
                  key={skId}
                  onClick={() => {
                    onSelectSkill(skId);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#FFF8F3] text-[#5B2333] font-bold' : 'hover:bg-[#FFF8F3] text-[#29201D]'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#29201D]">{sk.name}</p>
                    <p className="text-[10px] text-[#665550]">{sk.category}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#C86B7B]" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSkillSelect;
