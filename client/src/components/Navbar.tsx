import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Compass, LogOut, User, Settings as SettingsIcon, Shield, Search, Users, Plus } from 'lucide-react';

/**
 * Top Navbar component styled with a premium editorial travel brand design.
 */
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Traveler';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="bg-paper/95 border-b border-sand text-charcoal sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between min-h-16 gap-6">
          
          <Link to="/dashboard" className="flex items-center space-x-2 text-teal font-editorial font-bold text-lg tracking-tight">
            <Compass className="h-5.5 w-5.5 text-coral" />
            <span>TripPilot</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 mr-auto ml-8">
            {[{ href: '/explore', label: 'Explore', icon: Search }, { href: '/trips', label: 'Trips', icon: Users }, { href: '/trips/new', label: 'Planner', icon: Plus }].map(({ href, label, icon: Icon }) => <Link key={href} to={href} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${location.pathname === href ? 'text-teal' : 'text-charcoal-muted hover:text-teal'}`}><Icon className="h-3.5 w-3.5" /><span>{label}</span></Link>)}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/community" className="hidden lg:flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal-muted hover:text-teal" title="Community trips"><Users className="h-3.5 w-3.5" /><span>Discover</span></Link>
            <div className="flex items-center space-x-1.5 bg-sand-light border border-sand px-3 py-1.5 rounded-sm text-xs font-semibold text-charcoal-muted">
              <User className="h-4 w-4 text-teal" />
              <span className="hidden sm:inline">Hi, {userName}</span>
            </div>

            <Link
              to="/settings"
              className="p-2 text-charcoal-muted hover:text-teal hover:bg-sand-light rounded-md transition-colors"
              title="Profile Settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </Link>

            {localStorage.getItem('isAdmin') === 'true' && (
              <Link to="/admin" className="flex items-center space-x-1 text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 border border-sand hover:border-coral hover:text-coral px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-sand bg-paper/95 backdrop-blur-md px-4 py-2" aria-label="Mobile navigation">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {[{ href: '/explore', label: 'Explore', icon: Search }, { href: '/trips', label: 'Trips', icon: Users }, { href: '/trips/new', label: 'Plan', icon: Plus }, { href: '/profile', label: 'Profile', icon: User }].map(({ href, label, icon: Icon }) => <Link key={href} to={href} className={`flex min-w-16 flex-col items-center gap-1 py-1 text-[9px] font-bold uppercase tracking-wider ${location.pathname === href ? 'text-teal' : 'text-charcoal-muted'}`}><Icon className="h-4 w-4" /><span>{label}</span></Link>)}
        </div>
      </div>
    </nav>
  );
};
