import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { Star, MessageSquare, X, Send } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ReviewModal = ({ session, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  // Determine reviewee (partner)
  const isHost = session.host?._id === session.currentUserId;
  const partner = isHost ? session.participant : session.host;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await API.post('/reviews', {
        sessionId: session._id,
        revieweeId: partner?._id || partner,
        rating,
        comment,
      });

      if (res.data.success) {
        toast.success('Thank you for your rating & review!');
        if (onReviewSubmitted) onReviewSubmitted(res.data.review);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5B2333]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-[#F2E5DC] shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#F2E5DC] pb-3">
          <h3 className="text-lg font-black text-[#29201D] flex items-center space-x-2 font-['Outfit']">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Rate Your Session Partner</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C7770] hover:text-[#5B2333] hover:bg-[#FFF8F3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="text-center">
            <p className="text-xs text-[#665550] font-medium">
              How was your learning exchange session with <strong className="text-[#5B2333]">{partner?.name || 'your partner'}</strong>?
            </p>

            <div className="my-4 flex justify-center">
              <RatingStars rating={rating} onRate={(val) => setRating(val)} size="lg" interactive />
            </div>
            <span className="text-xs font-black text-amber-800">
              {rating === 5 && '🌟 Outstanding! Super helpful'}
              {rating === 4 && '👍 Great session! Learned a lot'}
              {rating === 3 && '👌 Good, covered the basics'}
              {rating === 2 && '😐 Needs improvement'}
              {rating === 1 && '👎 Not helpful'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#5B2333] mb-1 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#C86B7B]" />
              <span>Written Feedback</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about what they taught well or how the session went..."
              rows={4}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input resize-none font-medium"
              required
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
              className="knowvia-btn-rose px-5 py-2 text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
