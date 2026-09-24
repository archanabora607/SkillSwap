import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import SkillBadge from '../components/SkillBadge';
import SearchableSkillSelect from '../components/SearchableSkillSelect';
import { Sparkles, User, Mail, Lock, BookOpen, GraduationCap, Plus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Basic Info State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    yearOfStudy: '2',
    major: 'Computer Science',
  });

  // Available skills from API
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  // Selected Skills State
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);

  // Form Selectors
  const [selectedTeachSkillId, setSelectedTeachSkillId] = useState('');
  const [teachLevel, setTeachLevel] = useState('intermediate');
  const [selectedLearnSkillId, setSelectedLearnSkillId] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get('/skills');
        const skillsList = res.data.data?.skills || res.data.skills || [];
        setAvailableSkills(skillsList);
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTeachSkill = () => {
    if (!selectedTeachSkillId) return;
    const skillObj = availableSkills.find((s) => s._id === selectedTeachSkillId);
    if (!skillObj) return;

    if (skillsToTeach.some((st) => st.skill._id === skillObj._id)) {
      toast.error('Skill already added to teaching list');
      return;
    }

    setSkillsToTeach([...skillsToTeach, { skill: skillObj, level: teachLevel }]);
    setSelectedTeachSkillId('');
  };

  const handleRemoveTeachSkill = (id) => {
    setSkillsToTeach(skillsToTeach.filter((st) => st.skill._id !== id));
  };

  const handleAddLearnSkill = () => {
    if (!selectedLearnSkillId) return;
    const skillObj = availableSkills.find((s) => s._id === selectedLearnSkillId);
    if (!skillObj) return;

    if (skillsToLearn.some((sl) => sl.skill._id === skillObj._id)) {
      toast.error('Skill already added to learning list');
      return;
    }

    setSkillsToLearn([...skillsToLearn, { skill: skillObj, priority: 'high' }]);
    setSelectedLearnSkillId('');
  };

  const handleRemoveLearnSkill = (id) => {
    setSkillsToLearn(skillsToLearn.filter((sl) => sl.skill._id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (skillsToTeach.length === 0) {
      toast.error('Please add at least 1 skill you can teach.');
      return;
    }

    if (skillsToLearn.length === 0) {
      toast.error('Please add at least 1 skill you want to learn.');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      bio: formData.bio,
      year: Number(formData.yearOfStudy),
      department: formData.major,
      skillsToTeach: skillsToTeach.map((st) => ({
        skill: st.skill._id,
        level: st.level || 'intermediate',
      })),
      skillsToLearn: skillsToLearn.map((sl) => ({
        skill: sl.skill._id,
        priority: sl.priority || 'medium',
      })),
    };

    setSubmitting(true);
    const success = await register(payload);
    setSubmitting(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[90vh] py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-3 shadow-inner">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Create Your <span className="text-gradient">SkillSwap</span> Profile
        </h2>
        <p className="mt-2 text-xs text-gray-400">
          Search skills, type to filter, and build your peer exchange profile!
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Account Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 pb-2 border-b border-gray-800 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>1. Basic Profile Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  University Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@university.edu"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Major / Department *
                </label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science, Data Science, Design"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Year of Study *
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                >
                  <option value="1" className="bg-gray-900">1st Year (Freshman)</option>
                  <option value="2" className="bg-gray-900">2nd Year (Sophomore)</option>
                  <option value="3" className="bg-gray-900">3rd Year (Junior)</option>
                  <option value="4" className="bg-gray-900">4th Year (Senior)</option>
                  <option value="5" className="bg-gray-900">Postgraduate / Masters</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Short Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share a sentence about your learning goals and project interests..."
                rows={2}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input resize-none"
              />
            </div>
          </div>

          {/* Section 2: Skills You Can Teach */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-gray-800 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>2. Skills You Can Teach</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Type or Select Skill to Teach
                </label>
                <SearchableSkillSelect
                  skills={availableSkills}
                  selectedSkillId={selectedTeachSkillId}
                  onSelectSkill={(id) => setSelectedTeachSkillId(id)}
                  placeholder="Type skill name (e.g. Python, React)..."
                  type="teach"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={teachLevel}
                  onChange={(e) => setTeachLevel(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                >
                  <option value="beginner" className="bg-gray-900">Beginner</option>
                  <option value="intermediate" className="bg-gray-900">Intermediate</option>
                  <option value="advanced" className="bg-gray-900">Advanced</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddTeachSkill}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* List of Added Teach Skills */}
            <div className="mt-3 flex flex-wrap gap-2 min-h-[36px] p-3 rounded-xl bg-gray-900/50 border border-gray-800">
              {skillsToTeach.length === 0 ? (
                <span className="text-xs text-gray-500 italic">No teaching skills added yet</span>
              ) : (
                skillsToTeach.map((st) => (
                  <SkillBadge
                    key={st.skill._id}
                    skill={st.skill}
                    level={st.level}
                    type="teach"
                    onRemove={() => handleRemoveTeachSkill(st.skill._id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Section 3: Skills You Want to Learn */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 pb-2 border-b border-gray-800 flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>3. Skills You Want to Learn</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-10">
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Type or Select Skill to Learn
                </label>
                <SearchableSkillSelect
                  skills={availableSkills}
                  selectedSkillId={selectedLearnSkillId}
                  onSelectSkill={(id) => setSelectedLearnSkillId(id)}
                  placeholder="Type skill name (e.g. Node.js, SQL)..."
                  type="learn"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddLearnSkill}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* List of Added Learn Skills */}
            <div className="mt-3 flex flex-wrap gap-2 min-h-[36px] p-3 rounded-xl bg-gray-900/50 border border-gray-800">
              {skillsToLearn.length === 0 ? (
                <span className="text-xs text-gray-500 italic">No learning skills added yet</span>
              ) : (
                skillsToLearn.map((sl) => (
                  <SkillBadge
                    key={sl.skill._id}
                    skill={sl.skill}
                    type="learn"
                    onRemove={() => handleRemoveLearnSkill(sl.skill._id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Sign In
              </Link>
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-xl text-xs font-bold text-white bg-gradient-primary hover:bg-gradient-hover shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all transform active:scale-98"
            >
              <span>{submitting ? 'Creating Profile...' : 'Complete & Launch'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
