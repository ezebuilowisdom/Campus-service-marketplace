import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiBriefcase, FiGrid, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

export default function Auth({ onLoginSuccess }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'customer';

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [shopName, setShopName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login');
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let endpoint = '/auth/login';
      let payload = { email, password };

      if (mode === 'register') {
        endpoint = '/auth/signup';
        payload = {
          email,
          password,
          full_name: fullName,
          role,
          matric_number: role === 'customer' ? matricNumber : undefined,
          department: role === 'customer' ? department : undefined,
          bio: role === 'provider' ? bio : undefined,
          shop_name: role === 'provider' ? shopName : undefined
        };
      }

      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        onLoginSuccess(res.data.user);

        // Redirect based on role
        if (res.data.user.role === 'admin') navigate('/admin');
        else if (res.data.user.role === 'provider') navigate('/provider');
        else navigate('/customer');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl space-y-6"
      >
        {/* Back Link */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold font-sans">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            {mode === 'login' ? 'Sign in to access bookings, chats and wallets' : 'Register to start hiring or offering campus services'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1.5 rounded-xl border border-slate-200/20">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Register
          </button>
        </div>

        {/* Register Role Toggle */}
        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400">Join as a:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  role === 'customer' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-200/30 dark:border-slate-700/30 text-slate-500 hover:border-slate-300'
                }`}
              >
                <FiGrid className="w-4 h-4 mb-1" />
                <span className="text-xs font-bold">Student Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  role === 'provider' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-200/30 dark:border-slate-700/30 text-slate-500 hover:border-slate-300'
                }`}
              >
                <FiBriefcase className="w-4 h-4 mb-1" />
                <span className="text-xs font-bold">Service Provider</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-xs font-bold px-4 py-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Full Name</label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 gap-2">
                <FiUser className="text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alice Cooper"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-none outline-none py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Email Address</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 gap-2">
              <FiMail className="text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">Password</label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 gap-2">
              <FiLock className="text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Student Specific Fields */}
          {mode === 'register' && role === 'customer' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Matric No.</label>
                <input
                  type="text"
                  required
                  placeholder="2023/1004"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Department</label>
                <input
                  type="text"
                  required
                  placeholder="CS / Eng"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
            </div>
          )}

          {/* Provider Specific Fields: Shop Name + Bio */}
          {mode === 'register' && role === 'provider' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Store / Shop Name</label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 gap-2">
                  <FiShoppingBag className="text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dave's Barbershop, Quick Prints Hub"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Professional Bio</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Describe your skillset (e.g. Barbering since 2 years, hair styling projects...)"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-primary/30 outline-none"
                ></textarea>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all text-xs shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        {/* Demo Helper Text */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/20 text-[10px] text-slate-500 leading-relaxed text-center space-y-1">
          <span className="font-bold block text-slate-700 dark:text-slate-300">💡 Demo Defense Shortcut:</span>
          <span>Log in instantly using:</span>
          <div className="flex flex-wrap gap-1.5 justify-center mt-1">
            <span className="bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">admin@campusmarketplace.edu</span>
            <span className="bg-slate-200/50 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono">dave.dev@campusmarketplace.edu</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
