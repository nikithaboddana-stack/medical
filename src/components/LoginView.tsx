import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeartPulse, KeyRound, UserCheck, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [rollNumber, setRollNumber] = useState('21B91A0501');
  const [password, setPassword] = useState('21B91A0501');
  const [error, setError] = useState<string | null>(null);
  const [rememberSession, setRememberSession] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = login(rollNumber, password);
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const handleQuickFill = (roll: string) => {
    setRollNumber(roll);
    setPassword(roll);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20 text-white">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Hospital Staff Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage patient records and clinical medical history
            </p>
          </div>

          {/* Friendly note for student/evaluator */}
          <div className="mb-5 p-3.5 bg-blue-950/40 border border-blue-500/30 rounded-2xl text-xs text-blue-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Login Instructions:</strong> Enter your <strong>Roll Number</strong> as both your Staff ID and Password to sign in.
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Staff ID / Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 21B91A0501"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                />
                <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Same as your Roll Number"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me for this session</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm cursor-pointer"
            >
              Sign In to Portal
            </button>
          </form>

          {/* Quick 1-click test buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">
              Click to quick-fill sample accounts:
            </span>
            <div className="flex flex-wrap gap-2">
              {['21B91A0501', '22CS089', '20IT104'].map((roll) => (
                <button
                  key={roll}
                  type="button"
                  onClick={() => handleQuickFill(roll)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors font-medium cursor-pointer"
                >
                  {roll}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Patient Management</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Medical Records</span>
          </div>
        </div>
      </div>
    </div>
  );
};
