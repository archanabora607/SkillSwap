import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Sparkles, X } from 'lucide-react';

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

  const selectedSkill = skills.find((s) => s._id === selectedSkillId);

  const filteredSkills = skills.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Search Input Box */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-full px-3.5 py-2.5 rounded-xl glass-input flex items-center justify-between cursor-pointer focus-within:border-indigo-500"
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0 pr-2">
          <Search className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <input
            type="text"
            value={isOpen ? query : selectedSkill ? selectedSkill.name : ''}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
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
              className="p-0.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto glass-panel rounded-2xl border border-gray-800 shadow-2xl z-50 py-1 divide-y divide-gray-800/60 animate-in fade-in duration-150">
          {filteredSkills.length === 0 ? (
            <div className="px-4 py-3 text-center text-xs text-gray-500">
              No skills found matching "{query}"
            </div>
          ) : (
            filteredSkills.map((sk) => {
              const isSelected = sk._id === selectedSkillId;
              return (
                <div
                  key={sk._id}
                  onClick={() => {
                    onSelectSkill(sk._id);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-600/20 text-indigo-300' : 'hover:bg-gray-800/60 text-gray-200'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{sk.name}</p>
                    <p className="text-[10px] text-gray-400">{sk.category}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
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
