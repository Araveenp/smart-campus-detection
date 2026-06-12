import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] dot-pattern flex items-center justify-center p-4 md:p-8 text-[#e5e2e3]">
      <motion.div 
        className="w-full max-w-4xl bg-[#101112]/90 backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 inner-glow shadow-2xl relative shadow-black/80"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side - Info */}
        <div className="md:col-span-5 bg-[#0d0e0f]/50 border-r border-white/[0.05] p-8 md:p-10 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 shadow-[0_0_12px_rgba(94,107,255,0.2)]">
                <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
              </div>
              <span className="font-h3 text-[20px] font-bold tracking-tight text-on-surface">SmartCampus</span>
            </div>
            
            <h2 className="font-h2 text-[26px] leading-[1.2] text-on-surface font-bold tracking-tight mb-4">
              AI operating layer for campuses.
            </h2>
            <p className="text-body-md text-custom-text-muted leading-relaxed mb-8">
              Experience automated student complaint routing, generative SOP plans, and live telemetry data tracking.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[14px]">
                <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                <span>Generative AI Classification</span>
              </div>
              <div className="flex items-center gap-3 text-[14px]">
                <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                <span>RAG-Powered Action Plans</span>
              </div>
              <div className="flex items-center gap-3 text-[14px]">
                <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                <span>Interactive Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-[14px]">
                <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                <span>Real-time Priority Detection</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.05] text-[12px] text-custom-text-muted">
            Authorized portal for students and staff.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-transparent">
          <div className="w-full max-w-md mx-auto">
            <h1 className="font-h3 text-[28px] font-bold text-on-surface mb-2">Welcome back</h1>
            <p className="text-body-md text-custom-text-muted mb-8">Sign in to access campus operations</p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-custom-text-muted">mail</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
                    className={`w-full bg-[#16171a] border ${errors.email ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3.5 pl-12 w-full outline-none transition-all text-body-md inner-glow`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">error</span>{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-bold text-custom-text-muted uppercase tracking-wider">Password</label>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-custom-text-muted">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                    className={`w-full bg-[#16171a] border ${errors.password ? 'border-red-500/50' : 'border-white/[0.08]'} focus:border-primary text-white rounded-xl px-4 py-3.5 pl-12 w-full outline-none transition-all text-body-md inner-glow pr-12`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-custom-text-muted hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-[12px] font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">error</span>{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black py-3.5 rounded-xl font-body-lg font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-8 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-body-md text-custom-text-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white hover:text-primary font-semibold underline decoration-white/20 hover:decoration-primary transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
