import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import SkillBadge from '../components/SkillBadge';
import RatingStars from '../components/RatingStars';
import { User, Mail, BookOpen, GraduationCap, Award, Star, Plus, Check, Save } from 'lucide-react';
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

  const [availableSkills, setAvailableSkills] = useState([]);
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

        if (skillRes.data.success) setAvailableSkills(skillRes.data.skills);
        if (reviewRes.data.success) setReviews(reviewRes.data.reviews);
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
    const skillObj = availableSkills.find((s) => s._id === selectedTeachSkillId);
    if (!skillObj) return;

    if (skillsToTeach.some((st) => (st.skill._id || st.skill) === skillObj._id)) {
      toast.error('Skill already added to teaching list');
      return;
    }

    setSkillsToTeach([...skillsToTeach, { skill: skillObj, proficiencyLevel: teachLevel }]);
    setSelectedTeachSkillId('');
  };

  const handleRemoveTeachSkill = (id) => {
    setSkillsToTeach(skillsToTeach.filter((st) => (st.skill._id || st.skill) !== id));
  };

  const handleAddLearnSkill = () => {
    if (!selectedLearnSkillId) return;
    const skillObj = availableSkills.find((s) => s._id === selectedLearnSkillId);
    if (!skillObj) return;

    if (skillsToLearn.some((sl) => (sl.skill._id || sl.skill) === skillObj._id)) {
      toast.error('Skill already added to learning list');
      return;
    }

    setSkillsToLearn([...skillsToLearn, { skill: skillObj }]);
    setSelectedLearnSkillId('');
  };

  const handleRemoveLearnSkill = (id) => {
    setSkillsToLearn(skillsToLearn.filter((sl) => (sl.skill._id || sl.skill) !== id));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      yearOfStudy: Number(formData.yearOfStudy),
      skillsToTeach: skillsToTeach.map((st) => ({
        skill: st.skill._id || st.skill,
        proficiencyLevel: st.proficiencyLevel || 'Intermediate',
      })),
      skillsToLearn: skillsToLearn.map((sl) => ({
        skill: sl.skill._id || sl.skill,
      })),
    };

    await updateProfile(payload);
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
            <p className="text-xs text-indigo-400 font-semibold mt-0.5">
              {user?.major} • Year {user?.yearOfStudy}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <RatingStars rating={user?.ratingAverage || 0} size="sm" />
              <span className="text-xs font-bold text-white">
                {user?.ratingAverage?.toFixed(1) || '5.0'}
              </span>
              <span className="text-xs text-gray-500">({user?.ratingCount || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 pb-2 border-b border-gray-800 flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Personal Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Major / Field</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Year of Study</label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              >
                <option value="1" className="bg-gray-900">1st Year</option>
                <option value="2" className="bg-gray-900">2nd Year</option>
                <option value="3" className="bg-gray-900">3rd Year</option>
                <option value="4" className="bg-gray-900">4th Year</option>
                <option value="5" className="bg-gray-900">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Avatar Image URL</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Short Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input resize-none"
            />
          </div>
        </div>

        {/* Edit Skills to Teach */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-gray-800 flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Skills You Can Teach</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-6">
              <select
                value={selectedTeachSkillId}
                onChange={(e) => setSelectedTeachSkillId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              >
                <option value="">Select skill...</option>
                {availableSkills.map((sk) => (
                  <option key={sk._id} value={sk._id} className="bg-gray-900">
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <select
                value={teachLevel}
                onChange={(e) => setTeachLevel(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              >
                <option value="Beginner" className="bg-gray-900">Beginner</option>
                <option value="Intermediate" className="bg-gray-900">Intermediate</option>
                <option value="Advanced" className="bg-gray-900">Advanced</option>
                <option value="Expert" className="bg-gray-900">Expert</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddTeachSkill}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 p-3 rounded-xl bg-gray-900/50 border border-gray-800">
            {skillsToTeach.map((st) => {
              const skillObj = st.skill;
              return (
                <SkillBadge
                  key={skillObj._id || skillObj}
                  skill={skillObj}
                  level={st.proficiencyLevel}
                  type="teach"
                  onRemove={() => handleRemoveTeachSkill(skillObj._id || skillObj)}
                />
              );
            })}
          </div>
        </div>

        {/* Edit Skills to Learn */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 pb-2 border-b border-gray-800 flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Skills You Want to Learn</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-10">
              <select
                value={selectedLearnSkillId}
                onChange={(e) => setSelectedLearnSkillId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
              >
                <option value="">Select skill...</option>
                {availableSkills.map((sk) => (
                  <option key={sk._id} value={sk._id} className="bg-gray-900">
                    {sk.name} ({sk.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddLearnSkill}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 p-3 rounded-xl bg-gray-900/50 border border-gray-800">
            {skillsToLearn.map((sl) => {
              const skillObj = sl.skill;
              return (
                <SkillBadge
                  key={skillObj._id || skillObj}
                  skill={skillObj}
                  type="learn"
                  onRemove={() => handleRemoveLearnSkill(skillObj._id || skillObj)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-primary hover:bg-gradient-hover shadow-lg flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Reviews Received Section */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>Peer Reviews & Ratings ({reviews.length})</span>
        </h3>

        {reviews.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">
            No peer reviews received yet. Complete sessions to build your reputation!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rev.reviewer?.name}</span>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-gray-300 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
