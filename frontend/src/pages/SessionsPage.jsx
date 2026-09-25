import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ReviewModal from '../components/ReviewModal';
import RatingStars from '../components/RatingStars';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Star,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#FFF8F3]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#F2E5DC] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Learning Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#29201D] font-['Outfit']">
            Peer Learning <span className="text-gradient">Sessions</span>
          </h1>
          <p className="text-xs text-[#665550] mt-1 font-medium">
            Join video meetings, track upcoming study slots, and rate your exchange partners.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-3 bg-white p-1.5 rounded-2xl border border-[#F2E5DC] w-fit shadow-xs">
        {['Scheduled', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === st
                ? 'bg-[#5B2333] text-white shadow-md'
                : 'text-[#665550] hover:text-[#5B2333]'
            }`}
          >
            {st} Sessions
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-[#665550] knowvia-card rounded-2xl">
          Loading learning sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center knowvia-card rounded-2xl border border-[#E8D8CC] text-[#665550] text-xs font-medium">
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
                className="knowvia-card-3d p-6 border border-[#E8D8CC] space-y-4 hover:border-[#C86B7B]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-[#29201D] text-base font-['Outfit']">{session.title}</h3>
                    <p className="text-xs text-[#665550] flex items-center space-x-1.5 mt-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C86B7B]" />
                      <span>{session.scheduledAt ? format(new Date(session.scheduledAt), 'PPP p') : ''}</span>
                      <span>({session.durationMinutes} mins)</span>
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      session.status === 'Scheduled'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : session.status === 'Completed'
                        ? 'bg-[#5B2333]/10 text-[#5B2333] border-[#5B2333]/30'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                {/* Partner Info */}
                <div className="p-3 rounded-xl bg-[#FFF8F3] border border-[#F2E0D5] flex items-center space-x-3">
                  {partner?.avatar ? (
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#F4B6A6]/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#5B2333] flex items-center justify-center font-black text-white text-sm">
                      {partner?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-[#29201D]">Partner: {partner?.name || 'Peer'}</p>
                    <p className="text-[11px] text-[#665550]">{partner?.major || partner?.department || 'Student'}</p>
                  </div>
                </div>

                {/* Description */}
                {session.description && (
                  <p className="text-xs text-[#29201D] bg-[#FFF8F3] p-3 rounded-xl border border-[#F2E5DC] font-medium">
                    <span className="font-extrabold text-[#5B2333] block mb-0.5">Agenda:</span>
                    {session.description}
                  </p>
                )}

                {/* Actions Bar */}
                <div className="pt-2 border-t border-[#F2E5DC] flex flex-wrap items-center justify-between gap-2">
                  {session.meetingLink && session.status === 'Scheduled' && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#5B2333] hover:bg-[#4A1C29] text-white text-xs font-extrabold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-[#F4B6A6]" />
                      <span>Join Meeting Link</span>
                    </a>
                  )}

                  {session.status === 'Scheduled' && (
                    <div className="flex items-center space-x-2 ml-auto">
                      <button
                        onClick={() => handleUpdateStatus(session._id, 'Cancelled')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#665550] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(session._id, 'Completed')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1 cursor-pointer shadow-xs"
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
                      className="px-4 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 ml-auto flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
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
