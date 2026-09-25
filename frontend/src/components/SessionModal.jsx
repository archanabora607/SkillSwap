import React, { useState } from 'react';
import { Calendar, Video, FileText, X } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const SessionModal = ({ exchange, isOpen, onClose, onSessionScheduled }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [meetingLink, setMeetingLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !scheduledAt) {
      toast.error('Please enter session title and scheduled time.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/sessions', {
        exchangeId: exchange._id,
        title,
        description,
        scheduledAt,
        durationMinutes: Number(durationMinutes),
        meetingLink,
      });

      if (res.data.success) {
        toast.success('Learning session scheduled!');
        if (onSessionScheduled) onSessionScheduled(res.data.session);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5B2333]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-[#F2E5DC] shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-3">
          <h3 className="text-lg font-black text-[#29201D] flex items-center space-x-2 font-['Outfit']">
            <Calendar className="w-5 h-5 text-[#C86B7B]" />
            <span>Schedule Learning Session</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C7770] hover:text-[#5B2333] hover:bg-[#FFF8F3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#5B2333] mb-1">
              Session Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Intro to React Hooks & State Management"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1">
                Duration (Minutes)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
              >
                <option value={30} className="bg-white text-[#29201D]">30 mins</option>
                <option value={45} className="bg-white text-[#29201D]">45 mins</option>
                <option value={60} className="bg-white text-[#29201D]">60 mins (1 hour)</option>
                <option value={90} className="bg-white text-[#29201D]">90 mins</option>
                <option value={120} className="bg-white text-[#29201D]">120 mins (2 hours)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#5B2333] mb-1 flex items-center space-x-1">
              <Video className="w-3.5 h-3.5 text-[#C86B7B]" />
              <span>Meeting URL (Google Meet / Zoom)</span>
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#5B2333] mb-1 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-[#C86B7B]" />
              <span>Agenda / Notes</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What topics will be covered? Any prerequisites to read?"
              rows={3}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input resize-none font-medium"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#F2E5DC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#665550] hover:text-[#5B2333] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="knowvia-btn-rose px-5 py-2 text-xs font-extrabold cursor-pointer"
            >
              {submitting ? 'Scheduling...' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionModal;
