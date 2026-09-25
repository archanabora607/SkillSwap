import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import RatingStars from '../components/RatingStars';
import {
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  Send,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SwapPage = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [partner, setPartner] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedRequestedSkill, setSelectedRequestedSkill] = useState('');
  const [introMessage, setIntroMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSwapDetails = async () => {
      try {
        setLoading(true);
        const [userRes, matchRes] = await Promise.all([
          API.get(`/users/${partnerId}`),
          API.get(`/matches/${partnerId}`),
        ]);

        const partnerUser = userRes.data.data?.user || userRes.data.user || userRes.data;
        const matchInfo = matchRes.data.data || matchRes.data;

        setPartner(partnerUser);
        setMatchData(matchInfo);

        // Pre-select compatible skills if available
        const matchedTeach = matchInfo.matchedTeachSkills || matchInfo.myTeachesMatches || [];
        const matchedLearn = matchInfo.matchedLearnSkills || matchInfo.myWantsMatches || [];

        // My skill to teach (must belong to currentUser.skillsToTeach)
        if (matchedTeach.length > 0) {
          const firstTeach = matchedTeach[0];
          setSelectedOfferedSkill(firstTeach._id || firstTeach);
        } else if (currentUser?.skillsToTeach?.length > 0) {
          const first = currentUser.skillsToTeach[0];
          setSelectedOfferedSkill(first.skill?._id || first.skill || first);
        }

        // Partner skill to learn (must belong to partner.skillsToTeach)
        if (matchedLearn.length > 0) {
          const firstLearn = matchedLearn[0];
          setSelectedRequestedSkill(firstLearn._id || firstLearn);
        } else if (partnerUser?.skillsToTeach?.length > 0) {
          const first = partnerUser.skillsToTeach[0];
          setSelectedRequestedSkill(first.skill?._id || first.skill || first);
        }
      } catch (err) {
        console.error('Failed to load partner for swap:', err);
        toast.error('Could not load user details for skill swap.');
      } finally {
        setLoading(false);
      }
    };

    if (partnerId) {
      fetchSwapDetails();
    }
  }, [partnerId, currentUser]);

  const handleSendSwapRequest = async (e) => {
    e.preventDefault();

    if (!selectedOfferedSkill || !selectedRequestedSkill) {
      toast.error('Please select both a skill you offer to teach and a skill you want to learn.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/exchanges', {
        receiverId: partner._id,
        senderSkillsOffered: [selectedOfferedSkill],
        receiverSkillsWanted: [selectedRequestedSkill],
        message: introMessage,
        matchScore: matchData?.matchPercentage || matchData?.score || 0,
      });

      if (res.data.success) {
        toast.success(`Skill swap request sent to ${partner.name}! 🎉`);
        navigate('/exchanges');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send exchange request.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to extract skill object cleanly
  const extractSkill = (entry) => {
    if (!entry) return null;
    if (entry.skill && typeof entry.skill === 'object') return entry.skill;
    return entry;
  };

  // Get current user's teach skills list
  const myTeachSkills = (currentUser?.skillsToTeach || [])
    .map(extractSkill)
    .filter(Boolean);

  // Get partner's teach skills list (which current user wants to learn)
  const partnerTeachSkills = (partner?.skillsToTeach || [])
    .map(extractSkill)
    .filter(Boolean);

  // Find selected skill objects for live preview
  const offeredSkillObj = myTeachSkills.find(
    (s) => (s._id || s) === selectedOfferedSkill
  );
  const requestedSkillObj = partnerTeachSkills.find(
    (s) => (s._id || s) === selectedRequestedSkill
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-[#665550] knowvia-card rounded-3xl bg-[#FFF8F3]">
        Loading skill swap parameters...
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center knowvia-card rounded-3xl border border-[#E8D8CC] bg-[#FFF8F3]">
        <p className="text-[#29201D] font-bold text-lg">Partner not found</p>
        <Link to="/explore" className="text-xs text-[#C86B7B] hover:underline mt-2 inline-block font-semibold">
          Return to Explore
        </Link>
      </div>
    );
  }

  const matchScore = matchData?.matchPercentage ?? matchData?.score ?? 0;
  const matchReasons = matchData?.reasons || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#FFF8F3]">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs text-[#5B2333] font-bold hover:text-[#C86B7B] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to partners</span>
      </button>

      {/* Main Container Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#5B2333] via-[#7A2E44] to-[#5B2333] text-[#FFF8F3] shadow-[0_12px_32px_rgba(91,35,51,0.22)] border border-[#7A2E44] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {partner.avatar ? (
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F4B6A6]/60 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#C86B7B] to-[#F4B6A6] flex items-center justify-center text-[#5B2333] font-black text-2xl shadow-lg">
                  {partner.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#FFF8F3] font-['Outfit']">{partner.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF8F3]/15 text-[#F4B6A6] border border-[#F4B6A6]/30">
                  {partner.college || 'Student'}
                </span>
              </div>
              <p className="text-xs text-[#F4B6A6]/90 mt-0.5 font-medium">
                {partner.department ? `${partner.department} • ` : ''}Skill Exchange Proposal
              </p>
              <div className="mt-1">
                <RatingStars rating={partner.rating?.average || partner.ratingAverage || 0} count={partner.rating?.count || partner.ratingCount || 0} size="sm" />
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="px-4 py-2 rounded-2xl bg-[#FFF8F3]/15 border border-[#F4B6A6]/40 flex items-center space-x-2 text-[#F4B6A6] font-black text-sm self-start sm:self-center shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F4B6A6]" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Why You Match Section */}
        {matchReasons.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#FFF8F3]/10 border border-[#F4B6A6]/20 space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#F4B6A6] block mb-1">
              Why You Match:
            </span>
            {matchReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs text-[#FFF8F3] font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{reason.replace(/\*\*/g, '')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Swap Request Form */}
      <form onSubmit={handleSendSwapRequest} className="knowvia-card-3d p-6 sm:p-8 border border-[#E8D8CC] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dropdown 1: YOU WILL TEACH */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-[#5B2333]">
              You Will Teach:
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl glass-input focus:ring-2 focus:ring-[#C86B7B] font-semibold"
              required
            >
              <option value="" disabled className="bg-white text-[#8C7770]">Select a skill you teach...</option>
              {myTeachSkills.map((s) => (
                <option key={s._id || s.name} value={s._id || s} className="bg-white text-[#29201D]">
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#665550]">
              Showing skills from your teach list ({myTeachSkills.length} available).
            </p>
          </div>

          {/* Dropdown 2: YOU WILL LEARN */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-[#C86B7B]">
              You Will Learn from {partner.name.split(' ')[0]}:
            </label>
            <select
              value={selectedRequestedSkill}
              onChange={(e) => setSelectedRequestedSkill(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl glass-input focus:ring-2 focus:ring-[#C86B7B] font-semibold"
              required
            >
              <option value="" disabled className="bg-white text-[#8C7770]">Select a skill they teach...</option>
              {partnerTeachSkills.map((s) => (
                <option key={s._id || s.name} value={s._id || s} className="bg-white text-[#29201D]">
                  {s.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#665550]">
              Showing skills taught by {partner.name} ({partnerTeachSkills.length} available).
            </p>
          </div>
        </div>

        {/* Live Exchange Preview Box */}
        <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-[#F2E0D5] space-y-3 shadow-inner">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#5B2333] block text-center">
            Exchange Preview
          </span>
          <div className="flex items-center justify-around gap-4 text-center">
            {/* YOU */}
            <div className="space-y-1">
              <span className="text-xs text-[#665550] font-extrabold block">YOU</span>
              <span className="inline-block px-3.5 py-1.5 rounded-xl bg-[#5B2333]/10 text-[#5B2333] font-black text-sm border border-[#5B2333]/30">
                {offeredSkillObj?.name || 'Selected offered skill'}
              </span>
            </div>

            {/* SWAP ICON */}
            <div className="p-3 rounded-full bg-[#C86B7B]/15 text-[#C86B7B] border border-[#C86B7B]/30 animate-pulse">
              <ArrowRightLeft className="w-5 h-5" />
            </div>

            {/* PARTNER */}
            <div className="space-y-1">
              <span className="text-xs text-[#665550] font-extrabold block">{partner.name?.toUpperCase()}</span>
              <span className="inline-block px-3.5 py-1.5 rounded-xl bg-[#C86B7B]/15 text-[#5B2333] font-black text-sm border border-[#C86B7B]/30">
                {requestedSkillObj?.name || 'Selected requested skill'}
              </span>
            </div>
          </div>
        </div>

        {/* Intro Message */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-[#5B2333]">
            Intro Message (Optional):
          </label>
          <textarea
            value={introMessage}
            onChange={(e) => setIntroMessage(e.target.value)}
            placeholder={`Hi ${partner.name}! I'd love to swap ${offeredSkillObj?.name || 'my skill'} for ${requestedSkillObj?.name || 'your skill'}. Let's connect!`}
            rows={3}
            className="w-full px-4 py-3 text-xs rounded-xl glass-input resize-none font-medium"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[#F2E5DC]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-xs font-bold text-[#665550] hover:text-[#5B2333] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !selectedOfferedSkill || !selectedRequestedSkill}
            className="knowvia-btn-rose px-6 py-3 text-xs font-extrabold flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Sending Request...' : 'Send Swap Request'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SwapPage;
