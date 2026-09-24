import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MatchCard from '../components/MatchCard';
import { Compass, Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Discover Peers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Find Compatible <span className="text-gradient">Skill Partners</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse active students, filter by skills, and send peer exchange proposals.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or skill..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto py-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-800/60 text-gray-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-800/60 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Minimum Match Score Slider */}
        <div className="flex items-center space-x-3 w-full md:w-auto bg-gray-900/60 px-3 py-1.5 rounded-xl border border-gray-800">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-gray-400 whitespace-nowrap">
            Min Match: <strong className="text-white">{minMatch}%</strong>
          </span>
          <input
            type="range"
            min="0"
            max="90"
            step="10"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            className="w-24 accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Match Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-sm text-gray-400 glass-card rounded-2xl">
          Matching skills across campus network...
        </div>
      ) : matches.length === 0 ? (
        <div className="p-16 text-center glass-card rounded-2xl border border-gray-800">
          <Sparkles className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-base font-bold text-white">No students match your criteria</p>
          <p className="text-xs text-gray-400 mt-1">
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
