import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MatchCard from '../components/MatchCard';
import { Compass, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

const ExplorePage = () => {
  const [matches, setMatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minMatch, setMinMatch] = useState(0);

  const fetchExploreData = async () => {
    try {
      setLoading(true);
      const [matchRes, catRes] = await Promise.all([
        API.get(`/matches?minMatch=${minMatch}${selectedCategory ? `&category=${selectedCategory}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`),
        API.get('/skills/categories'),
      ]);

      const fetchedMatches = matchRes.data.data?.matches || matchRes.data.matches || [];
      const fetchedCategories = catRes.data.data?.categories || catRes.data.categories || [];

      setMatches(fetchedMatches);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Explore fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, [selectedCategory, minMatch, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#FFF8F3]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#F2E5DC] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#5B2333] font-black text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-[#C86B7B]" />
            <span>Discover Peers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#29201D] font-['Outfit']">
            Find Compatible <span className="text-gradient">Skill Partners</span>
          </h1>
          <p className="text-xs text-[#665550] mt-1 font-medium">
            Browse active students, filter by skills, and send peer exchange proposals.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="knowvia-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#E8D8CC]">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#C86B7B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or skill..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto py-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              !selectedCategory
                ? 'bg-[#5B2333] text-white shadow-md'
                : 'bg-[#FFF8F3] text-[#665550] hover:text-[#5B2333] border border-[#F2E0D5]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#5B2333] text-white shadow-md'
                  : 'bg-[#FFF8F3] text-[#665550] hover:text-[#5B2333] border border-[#F2E0D5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Minimum Match Score Slider */}
        <div className="flex items-center space-x-3 w-full md:w-auto bg-[#FFF8F3] px-3.5 py-2 rounded-xl border border-[#F2E0D5]">
          <SlidersHorizontal className="w-4 h-4 text-[#C86B7B]" />
          <span className="text-xs text-[#665550] whitespace-nowrap font-medium">
            Min Match: <strong className="text-[#5B2333] font-bold">{minMatch}%</strong>
          </span>
          <input
            type="range"
            min="0"
            max="90"
            step="10"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            className="w-24 accent-[#C86B7B] cursor-pointer"
          />
        </div>
      </div>

      {/* Match Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-sm text-[#665550] knowvia-card rounded-2xl">
          Matching skills across campus network...
        </div>
      ) : matches.length === 0 ? (
        <div className="p-16 text-center knowvia-card rounded-2xl border border-[#E8D8CC]">
          <Sparkles className="w-10 h-10 text-[#C86B7B] mx-auto mb-2" />
          <p className="text-base font-bold text-[#29201D]">No students match your criteria</p>
          <p className="text-xs text-[#665550] mt-1 font-medium">
            Try adjusting your search filters or resetting minimum match percentage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((match) => (
            <MatchCard key={match.user?._id || match._id} match={match} onRequestSent={fetchExploreData} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
