import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, Coins, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password. Try kunal@example.com / password123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center p-4 transition-colors duration-300">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-8 z-10 transition-all">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-500/20 mb-3">
            <Coins className="h-7 w-7" />
          </div>
          <h1 className="font-extrabold text-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
            WalletWise
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
            Access your Fintech Expense Dashboard
          </p>
        </div>

        {/* Global Errors */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 text-red-800 dark:text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium ${
                  fieldErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5 pl-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-emerald-500 hover:text-emerald-600 tracking-wide"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 text-sm rounded-xl border bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium ${
                  fieldErrors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-500"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-[10px] text-red-500 font-bold mt-1.5 pl-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all text-sm"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium mt-6">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-bold text-emerald-500 hover:text-emerald-600"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
