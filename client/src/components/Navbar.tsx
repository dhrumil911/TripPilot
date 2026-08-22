import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, LogOut, User, Settings as SettingsIcon } from 'lucide-react';

/**
 * Top Navbar component styled with a premium editorial travel brand design.
 */
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Traveler';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="bg-paper border-b border-sand text-charcoal sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/dashboard" className="flex items-center space-x-2 text-teal font-editorial font-bold text-lg tracking-tight">
            <Compass className="h-5.5 w-5.5 text-coral" />
            <span>TripPilot</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-sand-light border border-sand px-3 py-1.5 rounded text-xs font-semibold text-charcoal-muted">
              <User className="h-4 w-4 text-teal" />
              <span>Hi, {userName}</span>
            </div>

            <Link
              to="/settings"
              className="p-2 text-charcoal-muted hover:text-teal hover:bg-sand-light rounded-md transition-colors"
              title="Profile Settings"
            >
              <SettingsIcon className="h-4 w-4" />
            </Link>
            
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
    </nav>
  );
};
