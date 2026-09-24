import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import MatchCard from '../components/MatchCard';
import RatingStars from '../components/RatingStars';
import SkillBadge from '../components/SkillBadge';
import {
  Sparkles,
  Repeat,
  Calendar,
  Compass,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [matchRes, sessionRes, exchangeRes] = await Promise.all([
        API.get('/matches/recommendations?limit=6'),
        API.get('/sessions?status=Scheduled'),
        API.get('/exchanges'),
      ]);

      const fetchedMatches = matchRes.data.data?.matches || matchRes.data.matches || [];
      const fetchedSessions = sessionRes.data.data?.sessions || sessionRes.data.sessions || [];
      const fetchedExchanges = exchangeRes.data.data?.exchanges || exchangeRes.data.exchanges || [];

      setMatches(fetchedMatches);
      setSessions(fetchedSessions);
      setExchanges(fetchedExchanges);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingRequestsCount = exchanges.filter((e) => e.status === 'Pending').length;
  const activeExchangesCount = exchanges.filter((e) => e.status === 'Accepted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-gray-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>SkillSwap Active Partner Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-gradient">{user?.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
              Ready to learn new skills? Explore AI-matched student partners or check your scheduled learning sessions.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-gray-900/80 p-3 rounded-2xl border border-gray-800">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Reputation Rating</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <RatingStars rating={user?.rating?.average || 0} size="sm" />
                <span className="text-xs font-bold text-white">
                  {user?.rating?.average?.toFixed(1) || '5.0'}
                </span>
                <span className="text-[10px] text-gray-500">({user?.rating?.count || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/exchanges"
          className="glass-card p-5 rounded-2xl border border-gray-800 hover:border-indigo-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Active Skill Swaps</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{activeExchangesCount}</p>
          <span className="text-[11px] text-indigo-400 flex items-center space-x-1 mt-1">
            <span>View active partners</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/exchanges"
          className="glass-card p-5 rounded-2xl border border-gray-800 hover:border-purple-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Pending Requests</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{pendingRequestsCount}</p>
          <span className="text-[11px] text-purple-400 flex items-center space-x-1 mt-1">
            <span>Review proposals</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/sessions"
          className="glass-card p-5 rounded-2xl border border-gray-800 hover:border-emerald-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Scheduled Sessions</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{sessions.length}</p>
          <span className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1">
            <span>View schedule</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/explore"
          className="glass-card p-5 rounded-2xl border border-gray-800 hover:border-pink-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Top Compatible Matches</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">{matches.length}</p>
          <span className="text-[11px] text-pink-400 flex items-center space-x-1 mt-1">
            <span>Explore network</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {/* Main Grid: Recommended Skill Matches & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Top Match Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Top Recommended Compatible Partners</span>
              </h2>
              <p className="text-xs text-gray-400">
                Matched automatically based on your teach/learn preferences
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-400 glass-card rounded-2xl">
              Finding optimal skill partners...
            </div>
          ) : matches.length === 0 ? (
            <div className="p-10 text-center glass-card rounded-2xl border border-gray-800">
              <Compass className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-300">No high-match partners found yet</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Try adding more skills to your profile or browsing the explore tab!
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-primary text-white"
              >
                <span>Browse All Students</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((m) => (
                <MatchCard key={m.user?._id || m._id} match={m} onRequestSent={fetchDashboardData} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Sessions Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Upcoming Sessions</span>
            </h2>
            <Link
              to="/sessions"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="p-6 text-center glass-card rounded-2xl border border-gray-800 text-gray-500 text-xs">
                No upcoming learning sessions scheduled.
              </div>
            ) : (
              sessions.slice(0, 3).map((sess) => (
                <div key={sess._id} className="glass-card p-4 rounded-2xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {sess.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                      {sess.durationMinutes} min
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{sess.scheduledAt ? format(new Date(sess.scheduledAt), 'PPP p') : 'Scheduled'}</span>
                  </p>
                  {sess.meetingLink && (
                    <a
                      href={sess.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold transition-colors mt-2"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
