import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { User, Mail, Calendar, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back Link */}
        <Link to="/" className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-bold w-max">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="border-b border-gray-50 pb-3 flex items-center space-x-2 text-gray-900 font-bold text-lg">
            <User className="h-5 w-5 text-blue-600" />
            <span>Profile Settings</span>
          </div>

          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="text-gray-500 text-xs font-semibold">Loading profile information...</span>
            </div>
          ) : !profile ? (
            <p className="text-center text-gray-500 text-sm">Failed to load profile details.</p>
          ) : (
            <div className="space-y-6">
              {/* Account summary cards */}
              <div className="space-y-4">
                <div className="flex flex-col bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3.5">
                  <div className="flex items-center space-x-3 text-sm">
                    <User className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Full Name</span>
                      <span className="font-bold text-gray-800 text-base">{profile.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Email Address</span>
                      <span className="font-bold text-gray-800 text-base">{profile.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Member Since</span>
                      <span className="font-bold text-gray-800 text-base">
                        {new Date(profile.createdAt).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-700 leading-relaxed">
                  🌍 <strong>TripPilot Hackathon Member</strong>: Profile updates, custom languages, and multi-currency preferences will be implemented in later stages.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
