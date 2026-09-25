import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import MatchCard from '../components/MatchCard';
import RatingStars from '../components/RatingStars';
import {
  Sparkles,
  Repeat,
  Calendar,
  Compass,
  Clock,
  ArrowRight,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FFF8F3]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#5B2333] via-[#7A2E44] to-[#5B2333] text-[#FFF8F3] shadow-[0_12px_32px_rgba(91,35,51,0.22),inset_0_1px_0_rgba(255,255,255,0.25)] border border-[#7A2E44]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4B6A6]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FFF8F3]/15 border border-[#F4B6A6]/30 text-xs font-extrabold text-[#F4B6A6]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B6A6]" />
              <span>Knowvia Active Partner Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#FFF8F3] font-['Outfit']">
              Welcome back, <span className="text-[#F4B6A6]">{user?.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-[#F4B6A6]/90 max-w-2xl font-medium">
              Ready to learn new skills? Explore AI-matched student partners or check your scheduled learning sessions.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#FFF8F3] p-3 rounded-2xl border border-[#F4B6A6]/40 text-[#29201D] shadow-md">
            <div className="p-2.5 rounded-xl bg-[#5B2333] text-[#FFF8F3] shadow-xs">
              <Award className="w-6 h-6 text-[#F4B6A6]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-[#5B2333]">Reputation Rating</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <RatingStars rating={user?.rating?.average || 0} size="sm" />
                <span className="text-xs font-black text-[#29201D]">
                  {user?.rating?.average?.toFixed(1) || '5.0'}
                </span>
                <span className="text-[10px] text-[#665550] font-semibold">({user?.rating?.count || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/exchanges"
          className="knowvia-card-3d p-5 border border-[#E8D8CC] hover:border-[#C86B7B]/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#5B2333]">Active Skill Swaps</span>
            <div className="p-2 rounded-xl bg-[#5B2333]/10 text-[#5B2333] group-hover:scale-110 transition-transform">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#29201D] mt-2 font-['Outfit']">{activeExchangesCount}</p>
          <span className="text-[11px] text-[#C86B7B] font-bold flex items-center space-x-1 mt-1">
            <span>View active partners</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/exchanges"
          className="knowvia-card-3d p-5 border border-[#E8D8CC] hover:border-[#C86B7B]/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#5B2333]">Pending Requests</span>
            <div className="p-2 rounded-xl bg-[#C86B7B]/10 text-[#C86B7B] group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#29201D] mt-2 font-['Outfit']">{pendingRequestsCount}</p>
          <span className="text-[11px] text-[#C86B7B] font-bold flex items-center space-x-1 mt-1">
            <span>Review proposals</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/sessions"
          className="knowvia-card-3d p-5 border border-[#E8D8CC] hover:border-[#C86B7B]/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#5B2333]">Scheduled Sessions</span>
            <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-700 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#29201D] mt-2 font-['Outfit']">{sessions.length}</p>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1 mt-1">
            <span>View schedule</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        <Link
          to="/explore"
          className="knowvia-card-3d p-5 border border-[#E8D8CC] hover:border-[#C86B7B]/50 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#5B2333]">Top Compatible Matches</span>
            <div className="p-2 rounded-xl bg-[#F4B6A6]/30 text-[#5B2333] group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#29201D] mt-2 font-['Outfit']">{matches.length}</p>
          <span className="text-[11px] text-[#C86B7B] font-bold flex items-center space-x-1 mt-1">
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
              <h2 className="text-lg font-black text-[#29201D] flex items-center space-x-2 font-['Outfit']">
                <Sparkles className="w-5 h-5 text-[#C86B7B]" />
                <span>Top Recommended Compatible Partners</span>
              </h2>
              <p className="text-xs text-[#665550]">
                Matched automatically based on your teach/learn preferences
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-extrabold text-[#C86B7B] hover:text-[#5B2333] flex items-center space-x-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#665550] knowvia-card rounded-2xl">
              Finding optimal skill partners...
            </div>
          ) : matches.length === 0 ? (
            <div className="p-10 text-center knowvia-card rounded-2xl border border-[#E8D8CC]">
              <Compass className="w-10 h-10 text-[#C86B7B] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#29201D]">No high-match partners found yet</p>
              <p className="text-xs text-[#665550] mt-1 mb-4">
                Try adding more skills to your profile or browsing the explore tab!
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold knowvia-btn-rose"
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
            <h2 className="text-lg font-black text-[#29201D] flex items-center space-x-2 font-['Outfit']">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Upcoming Sessions</span>
            </h2>
            <Link
              to="/sessions"
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {sessions.length === 0 ? (
              <div className="p-6 text-center knowvia-card rounded-2xl border border-[#E8D8CC] text-[#8C7770] text-xs font-medium">
                No upcoming learning sessions scheduled.
              </div>
            ) : (
              sessions.slice(0, 3).map((sess) => (
                <div key={sess._id} className="knowvia-card p-4 rounded-2xl border border-[#E8D8CC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#29201D] truncate max-w-[200px] font-['Outfit']">
                      {sess.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                      {sess.durationMinutes} min
                    </span>
                  </div>
                  <p className="text-[11px] text-[#665550] flex items-center space-x-1 font-medium">
                    <Clock className="w-3 h-3 text-[#C86B7B]" />
                    <span>{sess.scheduledAt ? format(new Date(sess.scheduledAt), 'PPP p') : 'Scheduled'}</span>
                  </p>
                  {sess.meetingLink && (
                    <a
                      href={sess.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#5B2333]/10 hover:bg-[#5B2333]/20 text-[#5B2333] text-xs font-extrabold transition-colors mt-2"
                    >
                      <Video className="w-3.5 h-3.5 text-[#C86B7B]" />
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
