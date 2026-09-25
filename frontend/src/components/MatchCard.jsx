import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SkillBadge from './SkillBadge';
import RatingStars from './RatingStars';
import { Sparkles, ArrowRightLeft, CheckCircle2, User } from 'lucide-react';

const MatchCard = ({ match }) => {
  const navigate = useNavigate();
  const student = match.user || match;
  const matchPercentage = match.matchPercentage ?? match.score ?? 0;
  const matchReasons = match.reasons || [];

  const handleSwapSkillsClick = () => {
    navigate(`/swap/${student._id}`);
  };

  return (
    <div className="knowvia-card-3d p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Top subtle 3D highlight bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5B2333] via-[#C86B7B] to-[#F4B6A6]"></div>

      <div>
        {/* Top Header: Avatar, Name, Compatibility Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-[#F4B6A6]/60 shadow-md group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#5B2333] via-[#7A2E44] to-[#C86B7B] flex items-center justify-center text-[#FFF8F3] font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                  {student.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <Link
                to={`/user/${student._id}`}
                className="font-black text-[#29201D] group-hover:text-[#5B2333] transition-colors flex items-center space-x-1 text-base font-['Outfit']"
              >
                <span>{student.name}</span>
              </Link>
              <p className="text-xs text-[#665550] font-medium">
                {student.college || student.department || 'Student'} {student.year ? `• Year ${student.year}` : ''}
              </p>
              <div className="mt-1">
                <RatingStars rating={student.rating?.average || student.ratingAverage || 0} count={student.rating?.count || student.ratingCount || 0} size="sm" />
              </div>
            </div>
          </div>

          {/* Dynamic Compatibility Score Pill */}
          <div
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 font-black text-xs border shadow-sm ${
              matchPercentage >= 70
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : matchPercentage >= 40
                ? 'bg-[#F4B6A6]/25 text-[#5B2333] border-[#F4B6A6]/50'
                : 'bg-[#FFF8F3] text-[#5B2333] border-[#E8D8CC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C86B7B]" />
            <span>{matchPercentage}% Match</span>
          </div>
        </div>

        {/* Dynamic Match Reasons */}
        {matchReasons.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-[#FFF8F3] border border-[#F2E0D5] text-[11px] text-[#5B2333] space-y-1 shadow-inner">
            {matchReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{reason.replace(/\*\*/g, '')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bio */}
        {student.bio && (
          <p className="mt-3 text-xs text-[#665550] line-clamp-2 italic font-normal">
            "{student.bio}"
          </p>
        )}

        {/* Can Teach */}
        <div className="mt-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5B2333] block mb-1.5">
            Can Teach:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.skillsToTeach?.length > 0 ? (
              student.skillsToTeach.map((st) => (
                <SkillBadge key={st._id || st.skill?._id || st.skill} skill={st.skill || st} level={st.level} type="teach" />
              ))
            ) : (
              <span className="text-xs text-[#8C7770] italic">None listed</span>
            )}
          </div>
        </div>

        {/* Wants to Learn */}
        <div className="mt-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#C86B7B] block mb-1.5">
            Wants to Learn:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.skillsToLearn?.length > 0 ? (
              student.skillsToLearn.map((sl) => (
                <SkillBadge key={sl._id || sl.skill?._id || sl.skill} skill={sl.skill || sl} type="learn" />
              ))
            ) : (
              <span className="text-xs text-[#8C7770] italic">None listed</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-[#F2E5DC] flex items-center justify-between gap-2">
        <Link
          to={`/user/${student._id}`}
          className="text-xs font-bold text-[#5B2333] hover:text-[#C86B7B] transition-colors flex items-center space-x-1 px-3 py-1.5 rounded-xl hover:bg-[#FFF8F3]"
        >
          <User className="w-3.5 h-3.5 text-[#C86B7B]" />
          <span>View Profile</span>
        </Link>
        <button
          onClick={handleSwapSkillsClick}
          className="knowvia-btn-rose text-xs font-extrabold px-4 py-2 flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Swap Skills</span>
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
