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
    <div className="glass-card rounded-2xl p-5 border border-gray-800/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header: Avatar, Name, Compatibility Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {student.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <Link
                to={`/user/${student._id}`}
                className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center space-x-1 text-sm sm:text-base"
              >
                <span>{student.name}</span>
              </Link>
              <p className="text-xs text-gray-400">
                {student.college || student.department || 'Student'} {student.year ? `• Year ${student.year}` : ''}
              </p>
              <div className="mt-1">
                <RatingStars rating={student.rating?.average || student.ratingAverage || 0} count={student.rating?.count || student.ratingCount || 0} size="sm" />
              </div>
            </div>
          </div>

          {/* Dynamic Compatibility Score Pill */}
          <div
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 font-extrabold text-xs border shadow-sm ${
              matchPercentage >= 70
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : matchPercentage >= 40
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchPercentage}% Match</span>
          </div>
        </div>

        {/* Dynamic Match Reasons */}
        {matchReasons.length > 0 && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-gray-900/70 border border-gray-800/80 text-[11px] text-gray-300 space-y-1">
            {matchReasons.map((reason, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{reason.replace(/\*\*/g, '')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bio */}
        {student.bio && (
          <p className="mt-3 text-xs text-gray-400 line-clamp-2 italic">
            "{student.bio}"
          </p>
        )}

        {/* Can Teach */}
        <div className="mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1.5">
            Can Teach:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.skillsToTeach?.length > 0 ? (
              student.skillsToTeach.map((st) => (
                <SkillBadge key={st._id || st.skill?._id || st.skill} skill={st.skill || st} level={st.level} type="teach" />
              ))
            ) : (
              <span className="text-xs text-gray-500">None listed</span>
            )}
          </div>
        </div>

        {/* Wants to Learn */}
        <div className="mt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1.5">
            Wants to Learn:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.skillsToLearn?.length > 0 ? (
              student.skillsToLearn.map((sl) => (
                <SkillBadge key={sl._id || sl.skill?._id || sl.skill} skill={sl.skill || sl} type="learn" />
              ))
            ) : (
              <span className="text-xs text-gray-500">None listed</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3 border-t border-gray-800/60 flex items-center justify-between gap-2">
        <Link
          to={`/user/${student._id}`}
          className="text-xs font-semibold text-gray-400 hover:text-white transition-colors flex items-center space-x-1 px-2.5 py-1.5 rounded-lg hover:bg-gray-800"
        >
          <User className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </Link>
        <button
          onClick={handleSwapSkillsClick}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-primary hover:bg-gradient-hover text-white shadow-md shadow-indigo-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Swap Skills</span>
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
