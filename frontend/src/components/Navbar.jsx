import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Home, Bookmark, LayoutDashboard, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
    { name: 'My Tickets', path: '/my-events', icon: <Bookmark size={20} /> },
    { name: 'Organizer', path: '/organizer', icon: <LayoutDashboard size={20} /> }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Bar for both Mobile and Desktop */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Top Left: Profile Picture & Brand */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-soft hover:scale-105 transition-transform outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  JD
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-12 left-0 w-48 bg-white rounded-xl shadow-soft-hover border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                      <User size={16} /> Edit Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-100 mt-1 pt-2">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
              
              <NavLink to="/" className="text-xl font-bold text-gradient hover:scale-105 transition-transform duration-200">
                CampusEvents
              </NavLink>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 h-full">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `
                    relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200
                    ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}
                    group
                  `}
                >
                  <span>{item.name}</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </NavLink>
              ))}
            </div>
            
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] border-t border-slate-100 lg:hidden pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 p-2 text-[10px] font-medium transition-colors duration-200 w-full
                ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbars */}
      {/* Top spacer (always present now because top bar is always there) */}
      <div className="h-16" />
      {/* Bottom spacer (only on mobile) */}
      <div className="h-16 lg:hidden" />
    </>
  );
};

export default Navbar;
