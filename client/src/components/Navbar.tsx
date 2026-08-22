import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Compass, LogOut, User, Shield, Menu, X } from 'lucide-react';

/**
 * Top Navbar component styled with a premium editorial travel brand design.
 */
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Traveler';
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/settings', label: 'Settings' }
  ];

  return (
    <nav className="bg-surface/95 border-b border-sand text-charcoal sticky top-0 z-55 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 text-teal font-editorial font-bold text-lg sm:text-xl tracking-tight hover:opacity-90 transition-opacity">
            <Compass className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-coral" />
            <span className="font-editorial italic font-normal text-teal">Trip</span>
            <span className="font-editorial font-bold -ml-1">Pilot</span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link 
                key={href} 
                to={href} 
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  location.pathname === href 
                    ? 'text-teal border-b border-teal pb-0.5' 
                    : 'text-charcoal-muted hover:text-teal'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 px-2.5 py-1.5 bg-paper/60 border border-sand rounded-sm text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
              <User className="h-3.5 w-3.5 text-teal shrink-0" />
              <span>Hi, {userName}</span>
            </div>

            {localStorage.getItem('isAdmin') === 'true' && (
              <Link 
                to="/admin" 
                className={`flex items-center space-x-1 border border-sand hover:border-teal px-2.5 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  location.pathname === '/admin' ? 'text-teal border-teal/20 bg-paper/30' : 'text-charcoal-muted hover:bg-paper/30'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-teal shrink-0" />
                <span>Admin</span>
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 border border-sand hover:border-coral hover:text-coral px-2.5 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-paper/40"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>

          {/* Hamburger Menu Toggle (Mobile Only) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-charcoal hover:text-teal p-1.5 hover:bg-paper rounded-sm transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-sand bg-surface/98 flex flex-col p-4 space-y-3 font-sans shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2 px-2.5 py-2 bg-paper/60 border border-sand rounded-sm text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
            <User className="h-4 w-4 text-teal shrink-0" />
            <span>Hi, {userName}</span>
          </div>

          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setIsOpen(false)}
              className={`px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors border ${
                location.pathname === href
                  ? 'text-teal border-teal/20 bg-paper'
                  : 'text-charcoal-muted border-transparent hover:text-teal hover:bg-paper/40'
              }`}
            >
              {label}
            </Link>
          ))}

          {localStorage.getItem('isAdmin') === 'true' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors border ${
                location.pathname === '/admin'
                  ? 'text-teal border-teal/20 bg-paper'
                  : 'text-charcoal-muted border-transparent hover:text-teal hover:bg-paper/40'
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-teal shrink-0" />
              <span>Admin Panel</span>
            </Link>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center space-x-1.5 border border-sand hover:border-coral hover:text-coral px-3 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all hover:bg-paper/40 text-charcoal-muted"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};
