import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Sparkles, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  // Quick preset test accounts demo login helper
  const demoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    const success = await login(demoEmail, demoPassword);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#FFF8F3]">
      {/* Background depth graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F4B6A6]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#C86B7B]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="text-3xl font-black text-[#29201D] tracking-tight font-['Outfit']">
            Welcome back to <span className="text-gradient">Knowvia</span>
          </h2>
          <p className="mt-2 text-xs text-[#665550] font-medium">
            Sign in to connect with compatible student skill partners
          </p>
        </div>

        <div className="knowvia-card-3d p-8 shadow-2xl border border-[#E8D8CC]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1.5 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C86B7B]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-4 py-2.5 text-xs rounded-xl glass-input font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#5B2333] mb-1.5 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C86B7B]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-xs rounded-xl glass-input font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white knowvia-btn-rose flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Preset Options */}
          <div className="mt-6 pt-6 border-t border-[#F2E5DC]">
            <p className="text-[11px] font-extrabold text-[#5B2333] text-center mb-3">
              ⚡ Quick Demo Logins (Click to auto sign-in):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => demoLogin('alice@university.edu', 'password123')}
                className="p-2.5 rounded-xl bg-[#5B2333]/10 hover:bg-[#5B2333]/20 border border-[#5B2333]/20 text-[11px] font-bold text-[#5B2333] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C86B7B]" />
                <span>Alice (React & Node)</span>
              </button>
              <button
                type="button"
                onClick={() => demoLogin('bob@university.edu', 'password123')}
                className="p-2.5 rounded-xl bg-[#C86B7B]/10 hover:bg-[#C86B7B]/20 border border-[#C86B7B]/20 text-[11px] font-bold text-[#5B2333] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C86B7B]" />
                <span>Bob (Python & SQL)</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#665550]">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-[#C86B7B] hover:text-[#5B2333] transition-colors">
                Register in 1-step
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
