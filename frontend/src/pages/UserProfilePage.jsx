import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import SkillBadge from '../components/SkillBadge';
import RatingStars from '../components/RatingStars';
import { ArrowRightLeft, Star, BookOpen, GraduationCap, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const [userRes, reviewRes] = await Promise.all([
          API.get(`/users/${userId}`),
          API.get(`/reviews/user/${userId}`),
        ]);

        if (userRes.data.success) setStudent(userRes.data.user);
        if (reviewRes.data.success) setReviews(reviewRes.data.reviews);
      } catch (err) {
        toast.error('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div className="p-16 text-center text-sm text-[#665550] bg-[#FFF8F3]">Loading student profile...</div>;
  }

  if (!student) {
    return <div className="p-16 text-center text-sm text-rose-600 bg-[#FFF8F3]">Student not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FFF8F3]">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#5B2333] hover:text-[#C86B7B] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </button>

      {/* Profile Header */}
      <div className="knowvia-card-3d p-6 sm:p-8 border border-[#E8D8CC] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#F4B6A6]/60 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#5B2333] via-[#7A2E44] to-[#C86B7B] flex items-center justify-center text-[#FFF8F3] font-black text-3xl shadow-xl">
              {student.name?.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-[#29201D] font-['Outfit']">{student.name}</h1>
            <p className="text-xs text-[#5B2333] font-bold mt-0.5">
              {student.major || 'Student'} {student.yearOfStudy ? `• Year ${student.yearOfStudy}` : ''}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <RatingStars rating={student.ratingAverage || 0} size="sm" />
              <span className="text-xs font-bold text-[#29201D]">
                {student.ratingAverage?.toFixed(1) || '5.0'}
              </span>
              <span className="text-xs text-[#665550]">({student.ratingCount || 0} reviews)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/explore')}
          className="knowvia-btn-rose px-5 py-2.5 text-xs font-extrabold flex items-center space-x-2 cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Propose Skill Exchange</span>
        </button>
      </div>

      {/* Bio */}
      {student.bio && (
        <div className="knowvia-card-3d p-6 border border-[#E8D8CC]">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#5B2333] mb-2 font-['Outfit']">About Student</h3>
          <p className="text-xs text-[#665550] italic font-medium">"{student.bio}"</p>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="knowvia-card-3d p-6 border border-[#E8D8CC] space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#5B2333] flex items-center space-x-2 font-['Outfit']">
            <GraduationCap className="w-4 h-4 text-[#C86B7B]" />
            <span>Skills They Can Teach</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {student.skillsToTeach?.map((st) => (
              <SkillBadge key={st._id || st.skill._id} skill={st.skill} level={st.proficiencyLevel} type="teach" />
            ))}
          </div>
        </div>

        <div className="knowvia-card-3d p-6 border border-[#E8D8CC] space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#C86B7B] flex items-center space-x-2 font-['Outfit']">
            <BookOpen className="w-4 h-4" />
            <span>Skills They Want to Learn</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {student.skillsToLearn?.map((sl) => (
              <SkillBadge key={sl._id || sl.skill._id} skill={sl.skill} type="learn" />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="knowvia-card-3d p-6 border border-[#E8D8CC] space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center space-x-2 font-['Outfit']">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>Peer Feedback ({reviews.length})</span>
        </h3>

        {reviews.length === 0 ? (
          <p className="text-xs text-[#8C7770] py-4 text-center font-medium">No reviews yet for this student.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#F2E0D5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#29201D]">{rev.reviewer?.name}</span>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-[#665550] italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
