import React, { useEffect, useState } from 'react';
import API from '../services/api';
import SkillBadge from '../components/SkillBadge';
import SessionModal from '../components/SessionModal';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRightLeft,
  Check,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
    if (!skills || skills.length === 0) return <span className="text-xs text-[#8C7770] italic">None listed</span>;
    return skills.map((sk) => (
      <SkillBadge key={sk._id || sk.name || sk} skill={sk} type={type} />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#FFF8F3]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#F2E5DC] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#5B2333] font-black text-xs uppercase tracking-wider mb-1">
            <ArrowRightLeft className="w-4 h-4 text-[#C86B7B]" />
            <span>Exchange Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#29201D] font-['Outfit']">
            Skill Swap <span className="text-gradient">Requests & Active Trades</span>
          </h1>
          <p className="text-xs text-[#665550] mt-1 font-medium">
            Manage incoming proposals, track ongoing peer exchanges, and launch learning sessions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#F2E5DC] space-x-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-2 text-xs font-black transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer font-['Outfit'] ${
            activeTab === 'received'
              ? 'border-[#C86B7B] text-[#5B2333]'
              : 'border-transparent text-[#665550] hover:text-[#5B2333]'
          }`}
        >
          <span>Received Proposals</span>
          {receivedRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#5B2333] text-white text-[10px]">
              {receivedRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 px-2 text-xs font-black transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer font-['Outfit'] ${
            activeTab === 'sent'
              ? 'border-[#C86B7B] text-[#5B2333]'
              : 'border-transparent text-[#665550] hover:text-[#5B2333]'
          }`}
        >
          <span>Sent Proposals</span>
          {sentRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#E8D8CC] text-[#5B2333] text-[10px]">
              {sentRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-2 text-xs font-black transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer font-['Outfit'] ${
            activeTab === 'active'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-[#665550] hover:text-[#5B2333]'
          }`}
        >
          <span>Active Swaps</span>
          {activeExchanges.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              {activeExchanges.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-2 text-xs font-black transition-colors border-b-2 flex items-center space-x-2 whitespace-nowrap cursor-pointer font-['Outfit'] ${
            activeTab === 'completed'
              ? 'border-[#5B2333] text-[#5B2333]'
              : 'border-transparent text-[#665550] hover:text-[#5B2333]'
          }`}
        >
          <span>Completed</span>
          {completedExchanges.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#E8D8CC] text-[#5B2333] text-[10px]">
              {completedExchanges.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="p-12 text-center text-sm text-[#665550] knowvia-card rounded-2xl">
          Loading exchanges...
        </div>
      ) : (
        <div className="space-y-4">
          {/* TAB 1: RECEIVED REQUESTS */}
          {activeTab === 'received' && (
            <div>
              {receivedRequests.length === 0 ? (
                <div className="p-12 text-center knowvia-card rounded-2xl border border-[#E8D8CC] text-[#665550] text-xs font-medium">
                  No pending exchange requests received.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {receivedRequests.map((req) => (
                    <div key={req._id} className="knowvia-card-3d p-5 border border-[#E8D8CC] space-y-4">
                      <div className="flex items-center space-x-3">
                        {req.sender?.avatar ? (
                          <img
                            src={req.sender.avatar}
                            alt={req.sender.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#F4B6A6]/40"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#5B2333] flex items-center justify-center font-black text-white text-sm">
                            {req.sender?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-extrabold text-[#29201D] text-sm font-['Outfit']">{req.sender?.name}</h4>
                          <p className="text-xs text-[#665550]">{req.sender?.college || req.sender?.department || 'Student'}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FFF8F3] border border-[#F2E0D5] text-xs space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-[#5B2333] font-bold">They offer:</span>
                          <div className="flex gap-1">{renderSkillList(req.senderSkillsOffered, 'teach')}</div>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-[#5B2333] font-bold">They want from you:</span>
                          <div className="flex gap-1">{renderSkillList(req.receiverSkillsWanted, 'learn')}</div>
                        </div>
                        {req.message && (
                          <p className="text-[11px] text-[#665550] italic pt-1 border-t border-[#F2E5DC]">
                            "{req.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-2">
                        <button
                          onClick={() => handleAction(req._id, 'reject')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#665550] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'accept')}
                          className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center space-x-1 cursor-pointer"
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
                <div className="p-12 text-center knowvia-card rounded-2xl border border-[#E8D8CC] text-[#665550] text-xs font-medium">
                  You haven't sent any pending exchange proposals.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sentRequests.map((req) => (
                    <div key={req._id} className="knowvia-card-3d p-5 border border-[#E8D8CC] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {req.receiver?.avatar ? (
                            <img
                              src={req.receiver.avatar}
                              alt={req.receiver.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#F4B6A6]/40"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#C86B7B] flex items-center justify-center font-black text-white text-sm">
                              {req.receiver?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <h4 className="font-extrabold text-[#29201D] text-sm font-['Outfit']">{req.receiver?.name}</h4>
                            <p className="text-xs text-[#665550]">{req.receiver?.college || req.receiver?.department || 'Student'}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
                          Pending Approval
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FFF8F3] border border-[#F2E0D5] text-xs space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-[#5B2333] font-bold">You offered:</span>
                          <div className="flex gap-1">{renderSkillList(req.senderSkillsOffered, 'teach')}</div>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-[#5B2333] font-bold">You requested:</span>
                          <div className="flex gap-1">{renderSkillList(req.receiverSkillsWanted, 'learn')}</div>
                        </div>
                        {req.message && (
                          <p className="text-[11px] text-[#665550] italic pt-1 border-t border-[#F2E5DC]">
                            "{req.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleAction(req._id, 'cancel')}
                          className="px-3 py-1 text-xs text-[#665550] hover:text-rose-600 font-bold cursor-pointer"
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
                <div className="p-12 text-center knowvia-card rounded-2xl border border-[#E8D8CC] text-[#665550] text-xs font-medium">
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
                      <div key={exc._id} className="knowvia-card-3d p-5 border-2 border-emerald-500/40 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {partner?.avatar ? (
                              <img
                                src={partner.avatar}
                                alt={partner.name}
                                className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-400"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-base">
                                {partner?.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div>
                              <h4 className="font-extrabold text-[#29201D] text-sm font-['Outfit']">{partner?.name}</h4>
                              <p className="text-xs text-emerald-700 font-bold">Active Exchange Partner</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black">
                            Active Swap
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#FFF8F3] border border-[#F2E0D5] text-xs space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-[#5B2333] font-bold">You teach:</span>
                            <div className="flex gap-1">{renderSkillList(myOffered, 'teach')}</div>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-[#5B2333] font-bold">They teach you:</span>
                            <div className="flex gap-1">{renderSkillList(partnerOffered, 'learn')}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#F2E5DC]">
                          <button
                            onClick={() => handleAction(exc._id, 'complete')}
                            className="text-[11px] text-[#665550] hover:text-[#5B2333] font-bold cursor-pointer"
                          >
                            Mark Completed
                          </button>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate('/chat')}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5B2333] hover:bg-[#4A1C29] text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#F4B6A6]" />
                              <span>Chat</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedExchangeForSession(exc);
                                setSessionModalOpen(true);
                              }}
                              className="knowvia-btn-rose px-4 py-2 text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer"
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
                <div className="p-12 text-center knowvia-card rounded-2xl border border-[#E8D8CC] text-[#665550] text-xs font-medium">
                  No completed exchanges history yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedExchanges.map((exc) => {
                    const isSender = getParticipantId(exc.sender) === currentUserId;
                    const partner = isSender ? exc.receiver : exc.sender;
                    return (
                      <div key={exc._id} className="knowvia-card p-5 rounded-2xl border border-[#E8D8CC] space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-[#5B2333] text-white flex items-center justify-center font-black text-sm">
                            {partner?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#29201D] text-sm font-['Outfit']">{partner?.name}</h4>
                            <p className="text-xs text-[#C86B7B] font-bold">Completed Exchange</p>
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
