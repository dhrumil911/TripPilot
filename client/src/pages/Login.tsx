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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-paper">
      
      {/* Brand Pane (Left) */}
      <div className="hidden md:flex md:col-span-5 lg:col-span-6 bg-teal text-paper flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-teal/90 to-teal/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80" 
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
            01 / Chronicle
          </span>
          <h1 className="text-4xl lg:text-5xl font-editorial font-bold leading-tight tracking-tight">
            Plan the journey.<br />
            <span className="italic font-normal text-coral/95">Not just the destination.</span>
          </h1>
          <p className="text-paper/70 font-sans text-xs leading-relaxed">
            Organize multi-city stops, build daily itinerary logs, collaborate, and manage your travel budget dynamically.
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
            <h2 className="text-3xl font-editorial font-bold text-charcoal leading-tight tracking-tight">Welcome Back</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-sans">
              Sign in to access your travel journals
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2.5 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded-sm text-xs font-sans animate-fadeIn">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                <label htmlFor="password" className="label font-sans block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">
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
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 space-y-2 border-t border-sand/40 pt-6">
            <p className="text-xs text-charcoal-muted font-sans font-medium">
              Don't have an account?{' '}
              <Link to={destination ? `/register?destination=${encodeURIComponent(destination)}` : "/register"} className="font-bold text-coral hover:underline transition-all">
                Sign up now
              </Link>
            </p>
            <div>
              <Link to="/forgot-password" className="text-charcoal-muted hover:text-coral text-[10px] font-bold uppercase tracking-wider block font-sans">
                Forgot password?
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
