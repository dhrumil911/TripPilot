import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Compass, AlertCircle } from 'lucide-react';
import api from '../api/axios';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const destination = searchParams.get('destination');
  const recommendations = searchParams.get('recommendations');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);
      
      if (destination) {
        navigate(`/trips/new?destination=${encodeURIComponent(destination)}${recommendations ? `&recommendations=${encodeURIComponent(recommendations)}` : ''}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
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
          <h2 className="mt-2 text-3xl font-editorial font-bold text-charcoal">Welcome Back</h2>
          <p className="text-xs text-charcoal-muted uppercase tracking-wider">
            Sign in to access your multi-city journeys
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-coral/5 border-l-2 border-coral text-coral p-3 rounded text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 space-y-2">
          <p className="text-xs text-charcoal-muted">
            Don't have an account?{' '}
            <Link to={destination ? `/register?destination=${encodeURIComponent(destination)}${recommendations ? `&recommendations=${encodeURIComponent(recommendations)}` : ''}` : "/register"} className="font-bold text-coral hover:text-coral-hover transition-colors">
              Sign up now
            </Link>
          </p>
          <div>
            <Link to="/forgot-password" className="text-coral hover:text-coral/80 text-xs font-semibold">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
