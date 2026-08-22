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
    <div className="min-h-screen flex items-center justify-center bg-paper py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-paper border border-sand p-8 rounded-xl shadow-sm">
        <div className="text-center space-y-2">
          <div className="flex justify-center text-coral">
            <Compass className="h-10 w-10" />
          </div>
          <h2 className="mt-2 text-3xl font-editorial font-bold text-charcoal">Reset Password</h2>
          <p className="text-xs text-charcoal-muted uppercase tracking-wider">
            Enter your details to create a new password
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-coral/5 border-l-2 border-coral text-coral p-3 rounded text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center space-x-2 bg-teal/5 border-l-2 border-teal text-teal p-3 rounded text-xs">
            <CheckCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-sand rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">
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
                className="w-full px-3 py-2 border border-sand rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-sand rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded text-paper bg-teal hover:bg-teal-hover transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-charcoal-muted">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-coral hover:text-coral-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
