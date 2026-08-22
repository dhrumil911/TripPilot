import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { User, Mail, Calendar, ArrowLeft, Loader2, AlertCircle, Layout, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data.profile);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch user profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation (Matching Dashboard layout) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-paper border border-sand p-6 rounded-xl space-y-6 sticky top-24">
            
            <div className="space-y-1.5">
              <span className="text-[10px] text-coral font-extrabold uppercase tracking-widest">Navigation</span>
              <h2 className="text-xl font-editorial font-bold text-charcoal">Workspace</h2>
            </div>

            <nav className="space-y-1">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal hover:bg-sand-light rounded transition-colors"
              >
                <Layout className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-teal bg-sand-light rounded transition-colors"
              >
                <SettingsIcon className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </Link>
            </nav>

          </div>
        </aside>

        {/* Right Main Content pane */}
        <main className="lg:col-span-9 space-y-6">
          
          <Link to="/dashboard" className="flex items-center space-x-1.5 text-xs text-teal hover:text-teal-hover font-bold uppercase tracking-wider w-max">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="bg-paper border border-sand p-6 rounded-xl space-y-6">
            <div className="border-b border-sand pb-3 flex items-center space-x-2 text-charcoal font-editorial font-bold text-xl">
              <User className="h-5 w-5 text-teal" />
              <span>Profile Settings</span>
            </div>

            {error && (
              <div className="flex items-center space-x-2 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded text-xs animate-fadeIn">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-2">
                <Loader2 className="h-8 w-8 text-teal animate-spin" />
                <span className="text-charcoal-muted text-xs font-semibold">Loading profile information...</span>
              </div>
            ) : !profile ? (
              <p className="text-center text-charcoal-muted text-xs">Failed to load profile details.</p>
            ) : (
              <div className="space-y-6">
                
                {/* Account details cards */}
                <div className="space-y-4">
                  <div className="flex flex-col bg-sand-light/50 p-6 rounded-xl border border-sand space-y-5">
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <User className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-charcoal-muted tracking-wider">Full Name</span>
                        <span className="font-bold text-charcoal text-base">{profile.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-charcoal-muted tracking-wider">Email Address</span>
                        <span className="font-bold text-charcoal text-base">{profile.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-charcoal-muted tracking-wider">Member Since</span>
                        <span className="font-bold text-charcoal text-base">
                          {new Date(profile.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="bg-sand-light/35 border border-sand p-5 rounded-xl text-xs text-charcoal-muted leading-relaxed">
                    ⚙️ <strong>Workspace Preferences</strong>: Multi-currency split indexes, localized travel language presets, and profile edit capabilities will be configured in subsequent stages.
                  </div>
                </div>

              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};
