import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api/axios';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !name || !newPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, name, newPassword });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Password reset failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-paper">
      
      {/* Brand Pane (Left) */}
      <div className="hidden md:flex md:col-span-5 lg:col-span-6 bg-teal text-paper flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-teal/90 to-teal/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" 
          alt="Travel view" 
          className="absolute inset-0 h-full w-full object-cover opacity-25 grayscale pointer-events-none"
        />
        
        <div className="relative z-20 flex items-center space-x-2 text-paper font-editorial font-bold text-2xl tracking-tight">
          <Compass className="h-6 w-6 text-coral" />
          <span className="font-editorial italic font-normal text-paper">Trip</span>
          <span className="font-editorial font-bold -ml-1">Pilot</span>
        </div>

        <div className="relative z-20 space-y-4 max-w-sm">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block">
            03 / Recover
          </span>
          <h1 className="text-4xl lg:text-5xl font-editorial font-bold leading-tight tracking-tight">
            Regain your path.<br />
            <span className="italic font-normal text-coral/95">We'll help you back.</span>
          </h1>
          <p className="text-paper/70 font-sans text-xs leading-relaxed">
            Verify your name and email to establish a new password credential securely.
          </p>
        </div>

        <div className="relative z-20 text-[9px] uppercase tracking-widest text-paper/40 font-bold font-sans">
          &copy; {new Date().getFullYear()} TripPilot. Travel editorial command center.
        </div>
      </div>

      {/* Form Pane (Right) */}
      <div className="col-span-1 md:col-span-7 lg:col-span-6 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-surface">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal font-editorial font-bold text-xl tracking-tight md:hidden mb-4">
              <Compass className="h-5.5 w-5.5 text-coral" />
              <span>TripPilot</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-charcoal leading-tight tracking-tight">Reset Password</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-sans">
              Enter your details to create a new password
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2.5 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded-sm text-xs font-sans animate-fadeIn">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2.5 bg-green-50 border-l-2 border-green-500 text-green-700 p-4 rounded-sm text-xs font-sans animate-fadeIn">
              <CheckCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="label font-sans block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field rounded-sm text-xs font-sans"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="label font-sans block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                  Email Address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field rounded-sm text-xs font-sans"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="label font-sans block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                  New Password
                </label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="field rounded-sm text-xs font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest rounded-sm text-paper bg-teal hover:bg-teal-hover transition-colors disabled:opacity-50 shadow-sm font-sans"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 border-t border-sand/40 pt-6">
            <p className="text-xs text-charcoal-muted font-sans font-medium">
              Remember your password?{' '}
              <Link to="/login" className="font-bold text-coral hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};
