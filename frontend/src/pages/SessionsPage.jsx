import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ReviewModal from '../components/ReviewModal';
import RatingStars from '../components/RatingStars';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  Star,
  FileText,
  User,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Scheduled'); // 'Scheduled' | 'Completed' | 'Cancelled'
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const currentUserId = JSON.parse(localStorage.getItem('user'))?._id;

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/sessions?status=${statusFilter}`);
      if (res.data.success) {
        const fetchedSessions = res.data.data?.sessions || res.data.sessions || [];
        setSessions(fetchedSessions);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await API.patch(`/sessions/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Session marked as ${status.toLowerCase()}!`);
        fetchSessions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update session.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Learning Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Peer Learning <span className="text-gradient">Sessions</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Join video meetings, track upcoming study slots, and rate your exchange partners.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-3 bg-gray-900/60 p-1.5 rounded-2xl border border-gray-800 w-fit">
        {['Scheduled', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === st
                ? 'bg-gradient-primary text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {st} Sessions
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-400 glass-card rounded-2xl">
          Loading learning sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-gray-800 text-gray-400 text-xs">
          No {statusFilter.toLowerCase()} sessions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sessions.map((session) => {
            const isHost = session.host?._id === currentUserId;
            const partner = isHost ? session.participant : session.host;

            return (
              <div
                key={session._id}
                className="glass-card p-6 rounded-2xl border border-gray-800 space-y-4 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{session.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center space-x-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{session.scheduledAt ? format(new Date(session.scheduledAt), 'PPP p') : ''}</span>
                      <span>({session.durationMinutes} mins)</span>
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      session.status === 'Scheduled'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : session.status === 'Completed'
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                {/* Partner Info */}
                <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center space-x-3">
                  {partner?.avatar ? (
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                      {partner?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">Partner: {partner?.name || 'Peer'}</p>
                    <p className="text-[11px] text-gray-400">{partner?.major || partner?.department || 'Student'}</p>
                  </div>
                </div>

                {/* Description */}
                {session.description && (
                  <p className="text-xs text-gray-300 bg-gray-950/40 p-3 rounded-xl border border-gray-800/80">
                    <span className="font-semibold text-gray-400 block mb-0.5">Agenda:</span>
                    {session.description}
                  </p>
                )}

                {/* Actions Bar */}
                <div className="pt-2 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2">
                  {session.meetingLink && session.status === 'Scheduled' && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Meeting Link</span>
                    </a>
                  )}

                  {session.status === 'Scheduled' && (
                    <div className="flex items-center space-x-2 ml-auto">
                      <button
                        onClick={() => handleUpdateStatus(session._id, 'Cancelled')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(session._id, 'Completed')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete</span>
                      </button>
                    </div>
                  )}

                  {session.status === 'Completed' && (
                    <button
                      onClick={() => {
                        setSelectedSessionForReview({ ...session, currentUserId });
                        setReviewModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 ml-auto flex items-center space-x-1.5 transition-colors"
                    >
                      <Star className="w-4 h-4 fill-amber-300" />
                      <span>Rate & Review Partner</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rate & Review Modal */}
      {selectedSessionForReview && (
        <ReviewModal
          session={selectedSessionForReview}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onReviewSubmitted={() => fetchSessions()}
        />
      )}
    </div>
  );
};

export default SessionsPage;
