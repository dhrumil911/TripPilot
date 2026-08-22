import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Users, Map, MapPin, DollarSign, Layout, Settings as SettingsIcon, Shield, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { formatCurrency } from '../utils/currency';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users')
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Admin access required. You do not have permission to view this page.');
      } else {
        setError('Failed to load admin data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation */}
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
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal hover:bg-sand-light rounded transition-colors"
              >
                <SettingsIcon className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </Link>
              <Link 
                to="/admin" 
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-teal bg-sand-light rounded transition-colors"
              >
                <Shield className="h-4 w-4 shrink-0" />
                <span>Admin</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content pane */}
        <main className="lg:col-span-9 space-y-8">
          
          <div className="space-y-1">
            <h1 className="text-3xl font-editorial font-bold text-charcoal">Admin Analytics</h1>
            <p className="text-xs text-charcoal-muted uppercase tracking-wider">Overview of application metrics and users</p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded text-xs">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 bg-paper border border-sand rounded-xl flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-6 w-6 text-teal animate-spin" />
              <p className="text-charcoal-muted text-xs font-semibold">Loading admin data...</p>
            </div>
          ) : analytics && !error ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-sand rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-charcoal">{analytics.totalUsers || 0}</div>
                    <div className="text-[9px] uppercase tracking-wider text-charcoal-muted mt-1">Total Users</div>
                  </div>
                </div>
                
                <div className="bg-white border border-sand rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Map className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-charcoal">{analytics.totalTrips || 0}</div>
                    <div className="text-[9px] uppercase tracking-wider text-charcoal-muted mt-1">Total Trips</div>
                  </div>
                </div>
                
                <div className="bg-white border border-sand rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <MapPin className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-charcoal">{analytics.totalStops || 0}</div>
                    <div className="text-[9px] uppercase tracking-wider text-charcoal-muted mt-1">Total Stops</div>
                  </div>
                </div>

                <div className="bg-white border border-sand rounded-xl p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-charcoal">{analytics.totalExpenses ? formatCurrency(analytics.totalExpenses) : '₹0'}</div>
                    <div className="text-[9px] uppercase tracking-wider text-charcoal-muted mt-1">Total Expenses</div>
                  </div>
                </div>
              </div>

              {/* Top Cities and Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Cities */}
                <div className="bg-white border border-sand rounded-xl p-5 flex flex-col overflow-hidden">
                  <h3 className="font-editorial text-lg text-charcoal font-bold mb-4">Top Cities</h3>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs text-charcoal">
                      <thead className="bg-sand-light uppercase tracking-wider text-[10px] text-charcoal-muted">
                        <tr>
                          <th className="px-3 py-2 rounded-l">#</th>
                          <th className="px-3 py-2">City</th>
                          <th className="px-3 py-2">Country</th>
                          <th className="px-3 py-2 rounded-r text-right">Stops</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topCities?.length ? analytics.topCities.map((city: any, i: number) => (
                          <tr key={i} className="border-b border-sand/50 last:border-0 hover:bg-sand-light/50 transition-colors">
                            <td className="px-3 py-3 font-semibold text-charcoal-muted">{i + 1}</td>
                            <td className="px-3 py-3 font-semibold">{city.name}</td>
                            <td className="px-3 py-3">{city.country}</td>
                            <td className="px-3 py-3 text-right font-semibold text-teal">{city.count}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-3 py-4 text-center text-charcoal-muted text-xs">No city data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Activities */}
                <div className="bg-white border border-sand rounded-xl p-5 flex flex-col overflow-hidden">
                  <h3 className="font-editorial text-lg text-charcoal font-bold mb-4">Top Activities</h3>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs text-charcoal">
                      <thead className="bg-sand-light uppercase tracking-wider text-[10px] text-charcoal-muted">
                        <tr>
                          <th className="px-3 py-2 rounded-l">#</th>
                          <th className="px-3 py-2">Activity</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2 rounded-r text-right">Usage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topActivities?.length ? analytics.topActivities.map((act: any, i: number) => (
                          <tr key={i} className="border-b border-sand/50 last:border-0 hover:bg-sand-light/50 transition-colors">
                            <td className="px-3 py-3 font-semibold text-charcoal-muted">{i + 1}</td>
                            <td className="px-3 py-3 font-semibold">{act.name}</td>
                            <td className="px-3 py-3"><span className="bg-sand-light px-2 py-0.5 rounded text-[10px]">{act.category}</span></td>
                            <td className="px-3 py-3 text-right font-semibold text-teal">{act.count}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-3 py-4 text-center text-charcoal-muted text-xs">No activity data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* User Management */}
              <div className="bg-white border border-sand rounded-xl p-5 overflow-hidden">
                <h3 className="font-editorial text-lg text-charcoal font-bold mb-4">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-charcoal">
                    <thead className="bg-sand-light uppercase tracking-wider text-[10px] text-charcoal-muted">
                      <tr>
                        <th className="px-4 py-2 rounded-l">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2 text-center">Trips</th>
                        <th className="px-4 py-2 rounded-r">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length ? users.map((user: any) => (
                        <tr key={user.id} className="border-b border-sand/50 last:border-0 hover:bg-sand-light/50 transition-colors">
                          <td className="px-4 py-3 font-semibold">{user.name}</td>
                          <td className="px-4 py-3 text-charcoal-muted">{user.email}</td>
                          <td className="px-4 py-3">
                            {user.role === 'admin' ? (
                              <span className="bg-teal text-paper px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Admin</span>
                            ) : (
                              <span className="bg-sand text-charcoal px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">User</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center font-semibold">{user.tripCount || 0}</td>
                          <td className="px-4 py-3 text-charcoal-muted">{formatDate(user.createdAt)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-charcoal-muted text-xs">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}

        </main>
      </div>
    </div>
  );
};
