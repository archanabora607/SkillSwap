import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Repeat,
  MessageSquare,
  Calendar,
  Star,
  Users,
  CheckCircle2,
  Zap,
  ShieldCheck,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden space-y-20 py-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 sm:pt-16">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>The #1 Peer-to-Peer Student Skill Exchange Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Exchange Skills. <br />
          <span className="text-gradient">Empower Peers.</span> Learn Together.
        </h1>

        <p className="mt-6 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Stop paying for expensive courses. Swap what you know (e.g. <strong className="text-white">Python</strong>) for what you want to learn (e.g. <strong className="text-white">React</strong>) with compatible university partners.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-primary hover:bg-gradient-hover shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold text-gray-200 glass-card hover:bg-gray-800/80 border border-gray-700 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Demo Sign In</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        {/* Value Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free Peer Learning</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Real-time Socket Chat</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified Peer Ratings</span>
          </div>
        </div>
      </section>

      {/* How SkillSwap Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            How <span className="text-gradient">SkillSwap</span> Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Three simple steps to start swapping skills with fellow students on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-gray-800 relative group hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-extrabold text-lg mb-6 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Create Your Profile</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              List the skills you can teach (e.g., Python, SQL) and the skills you want to learn (e.g., React, Figma).
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-gray-800 relative group hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-extrabold text-lg mb-6 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Discover Compatible Peers</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our skill matching engine identifies students with reciprocal skill interests and calculates match scores.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-gray-800 relative group hover:border-pink-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center font-extrabold text-lg mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect & Learn</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Chat live in real time, schedule video meeting sessions, and build your student reputation with reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlight Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gray-800 bg-gradient-to-b from-gray-900/60 to-gray-950">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                <Repeat className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Smart Skill Matching</h4>
              <p className="text-xs text-gray-400">
                Instant match percentage algorithms based on complimentary skill gaps.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Real-Time Messaging</h4>
              <p className="text-xs text-gray-400">
                Socket.IO messaging with live typing indicators and unread badges.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Session Scheduler</h4>
              <p className="text-xs text-gray-400">
                Easily book learning time slots and attach Google Meet or Zoom URLs.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Reputation & Ratings</h4>
              <p className="text-xs text-gray-400">
                Earn star ratings and feedback reviews after each completed session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-gray-950 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Swap Your First Skill?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto mt-3">
            Join hundreds of students learning coding, design, and analytics directly from peers.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-primary hover:bg-gradient-hover shadow-xl shadow-indigo-500/30 flex items-center space-x-2 transition-all"
            >
              <span>Join SkillSwap Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
