
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister && !agreedToTerms) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: fullName,
            },
          },
        });
        if (error) throw error;
        if (!data.session) {
          alert('Registration successful! Please check your email to verify your account.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white animate-fadeIn px-8 pt-20 pb-10">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          {isRegister ? 'Create Account' : 'Welcome Back!'}
        </h2>
        <p className="text-slate-500">
          {isRegister ? 'Enter your details to get started' : 'Sign in to continue your discovery'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {isRegister && (
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
              <input
                type="text"
                required
                placeholder="Jane Cooper"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-14 bg-gray-50 border-none rounded-2xl px-12 text-sm focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
            <input
              type="email"
              required
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-gray-50 border-none rounded-2xl px-12 text-sm focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-gray-50 border-none rounded-2xl px-12 text-sm focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {isRegister && (
          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="size-5 rounded-md border-gray-300 text-primary focus:ring-primary transition-all"
            />
            <label htmlFor="terms" className="text-xs text-gray-500 font-medium leading-relaxed">
              I agree to the <span className="text-primary font-bold">Terms of Use</span> and <span className="text-primary font-bold">Privacy Policy</span>
            </label>
          </div>
        )}

        {!isRegister && (
          <div className="text-right">
            <button type="button" className="text-xs font-bold text-primary">Forgot Password?</button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-primary text-slate-900 font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="size-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
          ) : (
            isRegister ? 'Sign Up' : 'Sign In'
          )}
        </button>
      </form>

      <div className="mt-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">or continue with</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-slate-600 font-bold active:scale-95 transition-transform"
          >
            <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" className="size-5" alt="Google" />
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            className="h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-slate-600 font-bold active:scale-95 transition-transform"
          >
            <img src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg" className="size-5" alt="FB" />
            Facebook
          </button>
        </div>
      </div>

      <div className="mt-auto pt-10 text-center">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          className="text-sm font-medium text-slate-500"
        >
          {isRegister ? 'Already have an account?' : "Don't have an account?"} <span className="text-primary font-bold">{isRegister ? 'Sign In' : 'Sign Up'}</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
