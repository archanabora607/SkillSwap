import React, { useEffect, useState } from 'react';
import API from '../services/api';
import SkillBadge from '../components/SkillBadge';
import SessionModal from '../components/SessionModal';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRightLeft,
  Check,
  X,
  MessageSquare,
  Calendar,
  Clock,
  User,
  Sparkles,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ExchangesPage = () => {
  const { user } = useAuth();
  const currentUserId = user?._id;

  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent' | 'active' | 'completed'
  const [selectedExchangeForSession, setSelectedExchangeForSession] = useState(null);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const res = await API.get('/exchanges');
      if (res.data.success) {
        const fetchedExchanges = res.data.data?.exchanges || res.data.exchanges || [];
        setExchanges(fetchedExchanges);
      }
    } catch (err) {
      console.error('Failed to fetch exchanges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const getParticipantId = (p) => (p?._id || p || '').toString();

  // Safely filter exchange status
  const receivedRequests = exchanges.filter((e) => {
    const status = (e.status || '').toLowerCase();
    return status === 'pending' && getParticipantId(e.receiver) === currentUserId;
  });

  const sentRequests = exchanges.filter((e) => {
    const status = (e.status || '').toLowerCase();
    return status === 'pending' && getParticipantId(e.sender) === currentUserId;
  });

  const activeExchanges = exchanges.filter((e) => {
    const status = (e.status || '').toLowerCase();
    const isParticipant = getParticipantId(e.sender) === currentUserId || getParticipantId(e.receiver) === currentUserId;
    return status === 'accepted' && isParticipant;
  });

  const completedExchanges = exchanges.filter((e) => {
    const status = (e.status || '').toLowerCase();
    const isParticipant = getParticipantId(e.sender) === currentUserId || getParticipantId(e.receiver) === currentUserId;
    return status === 'completed' && isParticipant;
  });

  const handleAction = async (id, action) => {
    try {
      let endpoint = `/exchanges/${id}/${action}`;
      const res = await API.put(endpoint);
      if (res.data.success) {
        toast.success(`Exchange request ${action}ed!`);
        fetchExchanges();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} request.`);
    }
  };

  // Extract skills helper
  const renderSkillList = (skills, type) => {
    if (!skills || skills.length === 0) return <span className="text-xs text-gray-500">None listed</span>;
    return skills.map((sk) => (
      <SkillBadge key={sk._id || sk.name || sk} skill={sk} type={type} />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Exchange Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Skill Swap <span className="text-gradient">Requests & Active Trades</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage incoming proposals, track ongoing peer exchanges, and launch learning sessions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 space-x-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-2 text-xs font-bold transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'received'
              ? 'border-indigo-500 text-indigo-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <span>Received Proposals</span>
          {receivedRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px]">
              {receivedRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 px-2 text-xs font-bold transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'sent'
              ? 'border-indigo-500 text-indigo-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <span>Sent Proposals</span>
          {sentRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-[10px]">
              {sentRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-2 text-xs font-bold transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'active'
              ? 'border-emerald-500 text-emerald-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <span>Active Swaps</span>
          {activeExchanges.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
              {activeExchanges.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-2 text-xs font-bold transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'completed'
              ? 'border-purple-500 text-purple-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <span>Completed</span>
          {completedExchanges.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 text-[10px]">
              {completedExchanges.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-400 glass-card rounded-2xl">
          Loading exchanges...
        </div>
      ) : (
        <div className="space-y-4">
          {/* TAB 1: RECEIVED REQUESTS */}
          {activeTab === 'received' && (
            <div>
              {receivedRequests.length === 0 ? (
                <div className="p-12 text-center glass-card rounded-2xl border border-gray-800 text-gray-400 text-xs">
                  No pending exchange requests received.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {receivedRequests.map((req) => (
                    <div key={req._id} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
                      <div className="flex items-center space-x-3">
                        {req.sender?.avatar ? (
                          <img
                            src={req.sender.avatar}
                            alt={req.sender.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                            {req.sender?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-white text-sm">{req.sender?.name}</h4>
                          <p className="text-xs text-gray-400">{req.sender?.college || req.sender?.department || 'Student'}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-gray-400">They offer:</span>
                          <div className="flex gap-1">{renderSkillList(req.senderSkillsOffered, 'teach')}</div>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-gray-400">They want from you:</span>
                          <div className="flex gap-1">{renderSkillList(req.receiverSkillsWanted, 'learn')}</div>
                        </div>
                        {req.message && (
                          <p className="text-[11px] text-gray-300 italic pt-1 border-t border-gray-800">
                            "{req.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-2">
                        <button
                          onClick={() => handleAction(req._id, 'reject')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'accept')}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SENT REQUESTS */}
          {activeTab === 'sent' && (
            <div>
              {sentRequests.length === 0 ? (
                <div className="p-12 text-center glass-card rounded-2xl border border-gray-800 text-gray-400 text-xs">
                  You haven't sent any pending exchange proposals.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sentRequests.map((req) => (
                    <div key={req._id} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {req.receiver?.avatar ? (
                            <img
                              src={req.receiver.avatar}
                              alt={req.receiver.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-sm">
                              {req.receiver?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-white text-sm">{req.receiver?.name}</h4>
                            <p className="text-xs text-gray-400">{req.receiver?.college || req.receiver?.department || 'Student'}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                          Pending Approval
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-gray-400">You offered:</span>
                          <div className="flex gap-1">{renderSkillList(req.senderSkillsOffered, 'teach')}</div>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-gray-400">You requested:</span>
                          <div className="flex gap-1">{renderSkillList(req.receiverSkillsWanted, 'learn')}</div>
                        </div>
                        {req.message && (
                          <p className="text-[11px] text-gray-300 italic pt-1 border-t border-gray-800">
                            "{req.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleAction(req._id, 'cancel')}
                          className="px-3 py-1 text-xs text-gray-400 hover:text-red-400 font-semibold cursor-pointer"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACTIVE EXCHANGES */}
          {activeTab === 'active' && (
            <div>
              {activeExchanges.length === 0 ? (
                <div className="p-12 text-center glass-card rounded-2xl border border-gray-800 text-gray-400 text-xs">
                  No active skill swaps yet. Accept or send exchange requests to get started!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeExchanges.map((exc) => {
                    const isSender = getParticipantId(exc.sender) === currentUserId;
                    const partner = isSender ? exc.receiver : exc.sender;
                    const myOffered = isSender ? exc.senderSkillsOffered : exc.receiverSkillsWanted;
                    const partnerOffered = isSender ? exc.receiverSkillsWanted : exc.senderSkillsOffered;

                    return (
                      <div key={exc._id} className="glass-card p-5 rounded-2xl border border-emerald-500/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {partner?.avatar ? (
                              <img
                                src={partner.avatar}
                                alt={partner.name}
                                className="w-11 h-11 rounded-xl object-cover border border-emerald-500/30"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white text-base">
                                {partner?.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-white text-sm">{partner?.name}</h4>
                              <p className="text-xs text-emerald-400 font-semibold">Active Exchange Partner</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            Active Swap
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-gray-400">You teach:</span>
                            <div className="flex gap-1">{renderSkillList(myOffered, 'teach')}</div>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-gray-400">They teach you:</span>
                            <div className="flex gap-1">{renderSkillList(partnerOffered, 'learn')}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                          <button
                            onClick={() => handleAction(exc._id, 'complete')}
                            className="text-[11px] text-gray-400 hover:text-purple-400 font-semibold cursor-pointer"
                          >
                            Mark Completed
                          </button>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate('/chat')}
                              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Chat</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedExchangeForSession(exc);
                                setSessionModalOpen(true);
                              }}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-primary hover:bg-gradient-hover text-white shadow-md flex items-center space-x-1.5 cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Schedule Session</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLETED EXCHANGES */}
          {activeTab === 'completed' && (
            <div>
              {completedExchanges.length === 0 ? (
                <div className="p-12 text-center glass-card rounded-2xl border border-gray-800 text-gray-400 text-xs">
                  No completed exchanges history yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedExchanges.map((exc) => {
                    const isSender = getParticipantId(exc.sender) === currentUserId;
                    const partner = isSender ? exc.receiver : exc.sender;
                    return (
                      <div key={exc._id} className="glass-card p-5 rounded-2xl border border-gray-800 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                            {partner?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{partner?.name}</h4>
                            <p className="text-xs text-purple-400">Completed Exchange</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Schedule Session Modal */}
      {selectedExchangeForSession && (
        <SessionModal
          exchange={selectedExchangeForSession}
          isOpen={sessionModalOpen}
          onClose={() => setSessionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ExchangesPage;
