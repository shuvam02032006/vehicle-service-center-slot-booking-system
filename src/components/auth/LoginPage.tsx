import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ROLE_DISPLAY_NAMES } from '../../utils/permissions';
import {
  Wrench,
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, registerUser, users } = useApp();

  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');

  // Login form state (strictly starts empty)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (strictly starts empty, no email, no phone)
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('customer');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginUsername.trim()) {
      setErrorMsg('Please enter your username.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(loginUsername.trim(), loginPassword);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!registerFullName.trim() || !registerUsername.trim()) {
      setErrorMsg('Please enter your full name and choose a username.');
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser({
        fullName: registerFullName.trim(),
        username: registerUsername.trim().toLowerCase(),
        role: registerRole
      });

      setSuccessMsg(`Account created for ${registerFullName} with role: ${ROLE_DISPLAY_NAMES[registerRole]}. Logging in...`);
      setTimeout(async () => {
        await login(registerUsername.trim().toLowerCase());
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotUsername.trim()) return;
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30 mb-4">
          <Wrench className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          AutoPulse Service Center
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Role-Based Access Control &amp; OS Mutex Slot Booking System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Tabs: Sign In / Create Account */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'login'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'register'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Database Empty Alert (Only if 0 accounts exist) */}
          {users.length === 0 && (
            <div className="mb-5 p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs text-blue-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Initial System Setup</span>
              </div>
              <p className="text-[11px] text-blue-300/80 leading-relaxed">
                Database initialized empty. Please select <strong>Create Account</strong> to register an <strong>Administrator</strong> or <strong>Customer</strong> account.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {activeMode === 'login' ? (
            /* 1. LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordOpen(true);
                      setForgotSuccess(false);
                      setForgotUsername('');
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* 2. REGISTRATION FORM (No Email, No Phone) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={registerFullName}
                    onChange={(e) => setRegisterFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Choose username"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:border-blue-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    System Role *
                  </label>
                  <select
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 outline-hidden font-medium"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="service-manager">Service Manager</option>
                    <option value="service-advisor">Service Advisor</option>
                    <option value="service-technician">Service Technician</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Create a password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:border-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500 font-mono">
              Operating Systems Project &bull; Mutual Exclusion &amp; Mutex
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Username-based) */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span>Password Recovery</span>
            </div>

            {forgotSuccess ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                  Password reset token dispatched for user <strong className="text-white">@{forgotUsername}</strong>.
                </div>
                <button
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
                <p className="text-slate-400 text-xs">
                  Enter your registered username to reset your account password.
                </p>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter username"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 outline-hidden font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
