import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, LogOut, User } from 'lucide-react';

/**
 * Top Navbar component containing navigation branding, logged user details, and logout mechanisms.
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
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-wide">
            <Compass className="h-6 w-6" />
            <span>TripPilot</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-blue-700 px-3 py-1.5 rounded-md text-sm">
              <User className="h-4 w-4" />
              <span>Hi, {userName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
