import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { User, Mail, Calendar, ArrowLeft, Loader2, AlertCircle, Layout, Settings as SettingsIcon, Pencil, Trash2, Globe, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getDestinationImage } from '../data/destinations';

interface ProfileTrip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  stops?: Array<{ cityName: string; country: string }>;
}

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
  
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const [language, setLanguage] = useState(localStorage.getItem('preferredLanguage') || 'en');
  const [langSaved, setLangSaved] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [savedDestinations, setSavedDestinations] = useState<{cityName: string, country: string}[]>(JSON.parse(localStorage.getItem('savedDestinations') || '[]'));
  const [trips, setTrips] = useState<ProfileTrip[]>([]);

  useEffect(() => {
    fetchProfile();
    api.get('/trips').then((response) => setTrips(response.data.trips || [])).catch(() => setTrips([]));
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLanguage(val);
    localStorage.setItem('preferredLanguage', val);
    setLangSaved(true);
    setTimeout(() => setLangSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete('/user/account', { data: { password: deletePassword } });
      localStorage.clear();
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setDeleteError(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  const removeSavedDest = (index: number) => {
    const newDests = [...savedDestinations];
    newDests.splice(index, 1);
    setSavedDestinations(newDests);
    localStorage.setItem('savedDestinations', JSON.stringify(newDests));
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal selection:bg-coral/25 selection:text-charcoal">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-surface border border-sand p-6 rounded-sm space-y-6 sticky top-24">
            
            <div className="space-y-1.5">
              <span className="text-[9px] text-coral font-extrabold uppercase tracking-widest block">Navigation</span>
              <h2 className="text-xl font-editorial font-bold text-charcoal">Workspace</h2>
            </div>

            <nav className="space-y-1 font-sans">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal hover:bg-paper/50 rounded-sm transition-colors"
              >
                <Layout className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-teal bg-paper rounded-sm transition-colors"
              >
                <SettingsIcon className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </Link>
            </nav>

          </div>
        </aside>

        {/* Right Main Content pane */}
        <main className="lg:col-span-9 space-y-8 animate-fadeIn">
          
          <Link to="/dashboard" className="flex items-center space-x-1.5 text-[9px] text-teal hover:text-teal-hover font-bold uppercase tracking-widest w-max font-sans">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="bg-surface border border-sand p-6 rounded-sm space-y-6">
            <div className="border-b border-sand pb-3 flex items-center space-x-2 text-charcoal font-editorial font-bold text-xl">
              <User className="h-5 w-5 text-teal shrink-0" />
              <span>Profile Settings</span>
            </div>

            {error && (
              <div className="flex items-center space-x-2.5 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded-sm text-xs font-sans">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-2 font-sans">
                <Loader2 className="h-8 w-8 text-teal animate-spin" />
                <span className="text-charcoal-muted text-xs font-bold">Loading profile information...</span>
              </div>
            ) : !profile ? (
              <p className="text-center text-charcoal-muted text-xs font-sans">Failed to load profile details.</p>
            ) : (
              <div className="space-y-6 font-sans">
                
                {/* Account details cards */}
                <div className="space-y-4">
                  <div className="flex flex-col bg-paper/30 p-6 rounded-sm border border-sand space-y-5">
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <User className="h-5 w-5 text-gray-400 shrink-0" />
                      <div className="flex-1">
                        <span className="block text-[9px] uppercase font-bold text-charcoal-muted tracking-wider">Full Name</span>
                        {!editingName ? (
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="font-bold text-charcoal text-base">{profile.name}</span>
                            <button onClick={() => { setEditingName(true); setNewName(profile.name); setSaveSuccess(''); }} className="text-teal hover:text-teal-hover p-1 bg-paper border border-sand/40 rounded-sm">
                              <Pencil className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 mt-1">
                            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="bg-white border border-sand rounded-sm p-1.5 text-xs w-full max-w-xs focus:ring-1 focus:ring-teal" />
                            <div className="flex space-x-2">
                              <button 
                                onClick={async () => {
                                  setSaving(true);
                                  try {
                                    await api.patch('/user/profile', { name: newName });
                                    setProfile({ ...profile, name: newName });
                                    localStorage.setItem('userName', newName);
                                    setSaveSuccess('Name updated successfully');
                                    setEditingName(false);
                                  } catch (err) {
                                    console.error(err);
                                  } finally {
                                    setSaving(false);
                                  }
                                }} 
                                disabled={saving} 
                                className="bg-teal hover:bg-teal-hover text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button onClick={() => setEditingName(false)} className="border border-sand px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-paper">Cancel</button>
                            </div>
                          </div>
                        )}
                        {saveSuccess && <p className="text-green-700 text-[10px] font-semibold mt-1">{saveSuccess}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                      <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-charcoal-muted tracking-wider">Email Address</span>
                        <span className="font-bold text-charcoal text-base mt-0.5 block">{profile.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-charcoal-muted tracking-wider">Member Since</span>
                        <span className="font-bold text-charcoal text-base mt-0.5 block">
                          {new Date(profile.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="space-y-6">
            {[{ title: 'Preplanned Trips', items: trips.filter((trip) => new Date(trip.endDate) >= new Date()) }, { title: 'Previous Trips', items: trips.filter((trip) => new Date(trip.endDate) < new Date()) }].map((group) => {
              if (group.items.length === 0) return null;
              return (
                <section key={group.title} className="bg-surface border border-sand p-6 rounded-sm space-y-4 font-sans">
                  <div className="border-b border-sand pb-3">
                    <h2 className="font-editorial font-bold text-xl text-charcoal">{group.title}</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {group.items.map((trip) => {
                      const stop = trip.stops?.[0];
                      return (
                        <Link 
                          key={trip.id} 
                          to={`/trips/${trip.id}`} 
                          className="group flex gap-4 border border-sand bg-paper/30 p-3 rounded-sm hover:border-teal transition-all duration-300"
                        >
                          <img 
                            src={getDestinationImage(stop?.cityName, stop?.country)} 
                            alt={stop ? `${stop.cityName}, ${stop.country}` : trip.title} 
                            className="h-16 w-20 shrink-0 object-cover border border-sand rounded-sm grayscale-[15%] group-hover:grayscale-0 transition-all duration-500" 
                            onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }}
                          />
                          <div className="min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <h3 className="truncate font-bold text-sm text-charcoal group-hover:text-teal transition-colors leading-tight">
                                {trip.title}
                              </h3>
                              <p className="truncate text-[10px] text-charcoal-muted mt-0.5">
                                {stop ? `${stop.cityName}, ${stop.country}` : 'Multi-stop route'}
                              </p>
                            </div>
                            <p className="text-[9px] text-charcoal-muted font-bold mt-1">
                              {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
          
          {/* Preferences */}
          <div className="bg-surface border border-sand p-6 rounded-sm space-y-4">
            <div className="border-b border-sand pb-3 flex items-center space-x-2 text-charcoal font-editorial font-bold text-xl">
              <Globe className="h-5 w-5 text-teal shrink-0" />
              <span>Preferences</span>
            </div>
            <div className="space-y-4 font-sans">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-charcoal-muted uppercase tracking-wider block">Language</label>
                <select value={language} onChange={handleLanguageChange} className="bg-white border border-sand rounded-sm p-2 text-xs w-full max-w-xs focus:ring-1 focus:ring-teal">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="ja">Japanese</option>
                </select>
                {langSaved && <p className="text-green-700 text-[10px] font-semibold">Preference saved successfully</p>}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[9px] font-bold text-charcoal-muted uppercase tracking-wider block">Default Currency</label>
                <select disabled className="bg-paper border border-sand rounded-sm p-2.5 text-xs w-full max-w-xs text-charcoal font-semibold cursor-not-allowed opacity-80 font-sans">
                  <option value="INR">₹ INR — Indian Rupee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Saved Destinations */}
          <div className="bg-surface border border-sand p-6 rounded-sm space-y-4">
            <div className="border-b border-sand pb-3 flex items-center space-x-2 text-charcoal font-editorial font-bold text-xl">
              <Bookmark className="h-5 w-5 text-teal shrink-0" />
              <span>Saved Destinations</span>
            </div>
            {savedDestinations.length === 0 ? (
              <p className="text-xs text-charcoal-muted font-sans font-normal">No saved destinations yet. Browse cities from the Dashboard to save favorites.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-sans">
                {savedDestinations.map((dest, i) => (
                  <div key={i} className="flex items-center justify-between bg-paper/40 border border-sand rounded-sm p-3.5 gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-charcoal block truncate">{dest.cityName}</span>
                      <span className="text-charcoal-muted text-[10px] uppercase font-bold mt-0.5 block">{dest.country}</span>
                    </div>
                    <button onClick={() => removeSavedDest(i)} className="text-red-500 hover:text-red-700 text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-surface border border-red-200 p-6 rounded-sm space-y-4">
            <div className="border-b border-red-200 pb-3 flex items-center space-x-2 text-red-600 font-editorial font-bold text-xl">
              <Trash2 className="h-5 w-5 text-red-500 shrink-0" />
              <span>Danger Zone</span>
            </div>
            <p className="text-xs text-charcoal-muted font-sans">Deleting your account will permanently remove all trips, stops, itineraries, and expenses. This cannot be undone.</p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors font-sans shadow-sm">
                Delete Account
              </button>
            ) : (
              <div className="space-y-4 bg-red-50/50 p-5 rounded-sm border border-red-200 max-w-md font-sans">
                <p className="text-xs text-red-700 font-semibold">Enter your password to confirm deletion:</p>
                <input 
                  type="password" 
                  value={deletePassword} 
                  onChange={e => setDeletePassword(e.target.value)} 
                  className="bg-white border border-red-300 rounded-sm p-2 text-xs w-full max-w-xs focus:ring-1 focus:ring-red-500" 
                  placeholder="Your password" 
                />
                {deleteError && <p className="text-red-600 text-[10px] font-semibold">{deleteError}</p>}
                <div className="flex space-x-2 pt-1.5">
                  <button onClick={handleDeleteAccount} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }} className="border border-sand px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-paper transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};
