import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Repeat,
  MessageSquare,
  Calendar,
  Star,
  CheckCircle2,
  Zap,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden space-y-20 py-8 bg-[#FFF8F3]">
      {/* Background Ambient Depth Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#F4B6A6]/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-[#C86B7B]/15 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14">
        {/* Floating 3D Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#FFF8F3] border border-[#F4B6A6] text-[#5B2333] text-xs font-extrabold mb-6 shadow-[0_6px_20px_rgba(91,35,51,0.08)] animate-float">
          <Sparkles className="w-4 h-4 text-[#C86B7B]" />
          <span>The #1 Peer-to-Peer Student Skill Exchange Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#29201D] tracking-tight leading-tight max-w-4xl mx-auto font-['Outfit']">
          Exchange Skills. <br />
          <span className="text-gradient">Empower Peers.</span> Learn Together.
        </h1>

        <p className="mt-6 text-sm sm:text-base text-[#665550] max-w-2xl mx-auto leading-relaxed font-medium">
          Stop paying for expensive courses. Swap what you know (e.g. <strong className="text-[#5B2333] font-bold">Python</strong>) for what you want to learn (e.g. <strong className="text-[#5B2333] font-bold">React</strong>) with compatible university partners.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold text-white knowvia-btn-rose flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-1"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold text-[#5B2333] knowvia-card hover:bg-[#FFFBF8] border border-[#F4B6A6]/60 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Demo Sign In</span>
            <Zap className="w-4 h-4 text-[#C86B7B]" />
          </Link>
        </div>

        {/* Value Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5B2333] font-bold">
          <div className="flex items-center space-x-2 bg-[#FFF8F3] px-3.5 py-1.5 rounded-full border border-[#F2E0D5] shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Free Peer Learning</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#FFF8F3] px-3.5 py-1.5 rounded-full border border-[#F2E0D5] shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Real-time Socket Chat</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#FFF8F3] px-3.5 py-1.5 rounded-full border border-[#F2E0D5] shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Peer Ratings</span>
          </div>
        </div>
      </section>

      {/* How Knowvia Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-[#29201D] font-['Outfit']">
            How <span className="text-gradient">Knowvia</span> Works
          </h2>
          <p className="text-xs sm:text-sm text-[#665550] mt-2 font-medium">
            Three simple steps to start swapping skills with fellow students on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="knowvia-card-3d p-8 relative group hover:border-[#C86B7B]/50 transition-all">
            <div className="w-13 h-13 rounded-2xl bg-[#5B2333] text-[#FFF8F3] flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-[#5B2333]/20 group-hover:scale-110 transition-transform font-['Outfit']">
              1
            </div>
            <h3 className="text-lg font-extrabold text-[#29201D] mb-2 font-['Outfit']">Create Your Profile</h3>
            <p className="text-xs text-[#665550] leading-relaxed font-medium">
              List the skills you can teach (e.g., Python, SQL) and the skills you want to learn (e.g., React, Figma).
            </p>
          </div>

          <div className="knowvia-card-3d p-8 relative group hover:border-[#C86B7B]/50 transition-all">
            <div className="w-13 h-13 rounded-2xl bg-[#C86B7B] text-[#FFF8F3] flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-[#C86B7B]/20 group-hover:scale-110 transition-transform font-['Outfit']">
              2
            </div>
            <h3 className="text-lg font-extrabold text-[#29201D] mb-2 font-['Outfit']">Discover Compatible Peers</h3>
            <p className="text-xs text-[#665550] leading-relaxed font-medium">
              Our skill matching engine identifies students with reciprocal skill interests and calculates match scores.
            </p>
          </div>

          <div className="knowvia-card-3d p-8 relative group hover:border-[#C86B7B]/50 transition-all">
            <div className="w-13 h-13 rounded-2xl bg-[#F4B6A6] text-[#5B2333] flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-[#F4B6A6]/40 group-hover:scale-110 transition-transform font-['Outfit']">
              3
            </div>
            <h3 className="text-lg font-extrabold text-[#29201D] mb-2 font-['Outfit']">Connect & Learn</h3>
            <p className="text-xs text-[#665550] leading-relaxed font-medium">
              Chat live in real time, schedule video meeting sessions, and build your student reputation with reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlight Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="knowvia-card-3d p-8 sm:p-12 border border-[#E8D8CC]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#5B2333]/10 text-[#5B2333] border border-[#5B2333]/20 w-fit shadow-xs">
                <Repeat className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#29201D] text-base font-['Outfit']">Smart Skill Matching</h4>
              <p className="text-xs text-[#665550] leading-relaxed">
                Instant match percentage algorithms based on complimentary skill gaps.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#C86B7B]/10 text-[#C86B7B] border border-[#C86B7B]/20 w-fit shadow-xs">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#29201D] text-base font-['Outfit']">Real-Time Messaging</h4>
              <p className="text-xs text-[#665550] leading-relaxed">
                Socket.IO messaging with live typing indicators and unread badges.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-600/10 text-emerald-800 border border-emerald-600/20 w-fit shadow-xs">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#29201D] text-base font-['Outfit']">Session Scheduler</h4>
              <p className="text-xs text-[#665550] leading-relaxed">
                Easily book learning time slots and attach Google Meet or Zoom URLs.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-500/20 w-fit shadow-xs">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#29201D] text-base font-['Outfit']">Reputation & Ratings</h4>
              <p className="text-xs text-[#665550] leading-relaxed">
                Earn star ratings and feedback reviews after each completed session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#5B2333] via-[#7A2E44] to-[#5B2333] text-[#FFF8F3] shadow-[0_15px_35px_rgba(91,35,51,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F4B6A6]/10 rounded-full blur-2xl pointer-events-none"></div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#FFF8F3] font-['Outfit']">
            Ready to Swap Your First Skill?
          </h2>
          <p className="text-xs sm:text-sm text-[#F4B6A6] max-w-xl mx-auto mt-3 font-medium">
            Join hundreds of students learning coding, design, and analytics directly from peers.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl text-xs font-black text-[#5B2333] bg-[#F4B6A6] hover:bg-[#FFF8F3] shadow-lg shadow-[#5B2333]/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Join Knowvia Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
