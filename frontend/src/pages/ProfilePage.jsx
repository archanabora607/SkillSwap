import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import SkillBadge from '../components/SkillBadge';
import RatingStars from '../components/RatingStars';
import { DEFAULT_SKILLS } from '../constants/skills';
import { User, BookOpen, GraduationCap, Star, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    yearOfStudy: user?.yearOfStudy || 2,
    major: user?.major || '',
    avatar: user?.avatar || '',
  });

  const [availableSkills, setAvailableSkills] = useState(DEFAULT_SKILLS);
  const [skillsToTeach, setSkillsToTeach] = useState(user?.skillsToTeach || []);
  const [skillsToLearn, setSkillsToLearn] = useState(user?.skillsToLearn || []);

  const [selectedTeachSkillId, setSelectedTeachSkillId] = useState('');
  const [teachLevel, setTeachLevel] = useState('Intermediate');
  const [selectedLearnSkillId, setSelectedLearnSkillId] = useState('');

  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillRes, reviewRes] = await Promise.all([
          API.get('/skills'),
          user ? API.get(`/reviews/user/${user._id}`) : Promise.resolve({ data: { reviews: [] } }),
        ]);

        if (skillRes.data.success) {
          const list = skillRes.data.data?.skills || skillRes.data.skills || [];
          if (list.length > 0) setAvailableSkills(list);
        }
        if (reviewRes.data.success) setReviews(reviewRes.data.reviews || []);
      } catch (err) {
        console.error('Profile fetch failed:', err);
      }
    };
    fetchData();
  }, [user?._id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTeachSkill = () => {
    if (!selectedTeachSkillId) return;
    const skillObj = availableSkills.find((s) => (s._id || s.id) === selectedTeachSkillId);
    if (!skillObj) return;

    if (skillsToTeach.some((st) => (st.skill._id || st.skill.id || st.skill) === (skillObj._id || skillObj.id))) {
      toast.error('Skill already added to teaching list');
      return;
    }

    setSkillsToTeach([...skillsToTeach, { skill: skillObj, proficiencyLevel: teachLevel }]);
    setSelectedTeachSkillId('');
  };

  const handleRemoveTeachSkill = (id) => {
    setSkillsToTeach(skillsToTeach.filter((st) => (st.skill._id || st.skill.id || st.skill) !== id));
  };

  const handleAddLearnSkill = () => {
    if (!selectedLearnSkillId) return;
    const skillObj = availableSkills.find((s) => (s._id || s.id) === selectedLearnSkillId);
    if (!skillObj) return;

    if (skillsToLearn.some((sl) => (sl.skill._id || sl.skill.id || sl.skill) === (skillObj._id || skillObj.id))) {
      toast.error('Skill already added to learning list');
      return;
    }

    setSkillsToLearn([...skillsToLearn, { skill: skillObj }]);
    setSelectedLearnSkillId('');
  };

  const handleRemoveLearnSkill = (id) => {
    setSkillsToLearn(skillsToLearn.filter((sl) => (sl.skill._id || sl.skill.id || sl.skill) !== id));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      yearOfStudy: Number(formData.yearOfStudy),
      skillsToTeach: skillsToTeach.map((st) => ({
        skill: st.skill._id || st.skill.id || st.skill,
        proficiencyLevel: st.proficiencyLevel || 'Intermediate',
      })),
      skillsToLearn: skillsToLearn.map((sl) => ({
        skill: sl.skill._id || sl.skill.id || sl.skill,
      })),
    };

    await updateProfile(payload);
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FFF8F3]">
      {/* Header Profile Summary */}
      <div className="knowvia-card-3d p-6 border border-[#E8D8CC] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#F4B6A6]/60 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#5B2333] via-[#7A2E44] to-[#C86B7B] flex items-center justify-center text-[#FFF8F3] font-black text-3xl shadow-xl">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-[#29201D] font-['Outfit']">{user?.name}</h1>
            <p className="text-xs text-[#5B2333] font-bold mt-0.5">
              {user?.major} • Year {user?.yearOfStudy}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <RatingStars rating={user?.ratingAverage || 0} size="sm" />
              <span className="text-xs font-bold text-[#29201D]">
                {user?.ratingAverage?.toFixed(1) || '5.0'}
              </span>
              <span className="text-xs text-[#665550]">({user?.ratingCount || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSaveProfile} className="knowvia-card-3d p-6 sm:p-8 border border-[#E8D8CC] space-y-8">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#5B2333] mb-4 pb-2 border-b border-[#F2E5DC] flex items-center space-x-2 font-['Outfit']">
            <User className="w-4 h-4 text-[#C86B7B]" />
            <span>Personal Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1">Major / Field</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1">Year of Study</label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
              >
                <option value="1" className="bg-white text-[#29201D]">1st Year</option>
                <option value="2" className="bg-white text-[#29201D]">2nd Year</option>
                <option value="3" className="bg-white text-[#29201D]">3rd Year</option>
                <option value="4" className="bg-white text-[#29201D]">4th Year</option>
                <option value="5" className="bg-white text-[#29201D]">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1">Avatar Image URL</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-extrabold text-[#5B2333] mb-1">Short Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input resize-none font-medium"
            />
          </div>
        </div>

        {/* Edit Skills to Teach */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#5B2333] mb-4 pb-2 border-b border-[#F2E5DC] flex items-center space-x-2 font-['Outfit']">
            <GraduationCap className="w-4 h-4 text-[#C86B7B]" />
            <span>Skills You Can Teach</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-6">
              <select
                value={selectedTeachSkillId}
                onChange={(e) => setSelectedTeachSkillId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
              >
                <option value="">Select skill...</option>
                {availableSkills.map((sk) => (
                  <option key={sk._id || sk.id} value={sk._id || sk.id} className="bg-white text-[#29201D]">
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <select
                value={teachLevel}
                onChange={(e) => setTeachLevel(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
              >
                <option value="Beginner" className="bg-white text-[#29201D]">Beginner</option>
                <option value="Intermediate" className="bg-white text-[#29201D]">Intermediate</option>
                <option value="Advanced" className="bg-white text-[#29201D]">Advanced</option>
                <option value="Expert" className="bg-white text-[#29201D]">Expert</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddTeachSkill}
                className="w-full py-2 px-3 rounded-xl text-xs font-extrabold text-white bg-[#5B2333] hover:bg-[#4A1C29] cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 p-3 rounded-xl bg-[#FFF8F3] border border-[#F2E0D5]">
            {skillsToTeach.map((st) => {
              const skillObj = st.skill;
              return (
                <SkillBadge
                  key={skillObj._id || skillObj.id || skillObj}
                  skill={skillObj}
                  level={st.proficiencyLevel}
                  type="teach"
                  onRemove={() => handleRemoveTeachSkill(skillObj._id || skillObj.id || skillObj)}
                />
              );
            })}
          </div>
        </div>

        {/* Edit Skills to Learn */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#C86B7B] mb-4 pb-2 border-b border-[#F2E5DC] flex items-center space-x-2 font-['Outfit']">
            <BookOpen className="w-4 h-4" />
            <span>Skills You Want to Learn</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-10">
              <select
                value={selectedLearnSkillId}
                onChange={(e) => setSelectedLearnSkillId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
              >
                <option value="">Select skill...</option>
                {availableSkills.map((sk) => (
                  <option key={sk._id || sk.id} value={sk._id || sk.id} className="bg-white text-[#29201D]">
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddLearnSkill}
                className="w-full py-2 px-3 rounded-xl text-xs font-extrabold text-white bg-[#C86B7B] hover:bg-[#B55A6A] cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 p-3 rounded-xl bg-[#FFF8F3] border border-[#F2E0D5]">
            {skillsToLearn.map((sl) => {
              const skillObj = sl.skill;
              return (
                <SkillBadge
                  key={skillObj._id || skillObj.id || skillObj}
                  skill={skillObj}
                  type="learn"
                  onRemove={() => handleRemoveLearnSkill(skillObj._id || skillObj.id || skillObj)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-[#F2E5DC]">
          <button
            type="submit"
            disabled={submitting}
            className="knowvia-btn-rose px-6 py-2.5 text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Reviews Received Section */}
      <div className="knowvia-card-3d p-6 border border-[#E8D8CC] space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-amber-800 flex items-center space-x-2 font-['Outfit']">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>Peer Reviews & Ratings ({reviews.length})</span>
        </h3>

        {reviews.length === 0 ? (
          <p className="text-xs text-[#8C7770] py-4 text-center font-medium">
            No peer reviews received yet. Complete sessions to build your reputation!
          </p>
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

export default ProfilePage;
