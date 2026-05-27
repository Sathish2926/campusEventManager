import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, Calendar, Home, LayoutDashboard, LogOut, MoonStar, PanelTop, SunMedium, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getHomePath } from '../utils/routeHelpers';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    if (user?.role === 'organizer') {
      return [
        { name: 'Dashboard', path: '/organizer', icon: <LayoutDashboard size={20} /> },
        { name: 'Create Event', path: '/organizer/create', icon: <PanelTop size={20} /> },
        { name: 'Attendance', path: '/organizer/attendance', icon: <Calendar size={20} /> },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
      ];
    }

    return [
      { name: 'Home', path: '/student', icon: <Home size={20} /> },
      { name: 'Events', path: '/student/events', icon: <Calendar size={20} /> },
      { name: 'My Events', path: '/student/my-events', icon: <Bookmark size={20} /> },
      { name: 'Calendar', path: '/student/calendar', icon: <LayoutDashboard size={20} /> },
    ];
  }, [user?.role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const avatarText = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'CE';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm dark:bg-slate-950/90 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((currentValue) => !currentValue)}
                  className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-gradient-primary text-sm font-bold text-white shadow-soft transition-transform hover:scale-105 dark:border-slate-700"
                >
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">{avatarText}</span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft-hover dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(`/${user.role}/profile`);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <User size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-slate-800 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              <NavLink to={user ? getHomePath(user.role) : "/"} className="text-xl font-bold text-gradient transition-transform hover:scale-105">
                CampusEvents
              </NavLink>
            </div>

            <div className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === getHomePath(user?.role)}
                  className={({ isActive }) => `group relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  <span>{item.name}</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-primary transition-transform duration-300 group-hover:scale-x-100" />
                </NavLink>
              ))}

              <button
                onClick={toggleDarkMode}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/95 shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-16 items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === getHomePath(user?.role)}
              className={({ isActive }) => `flex w-full flex-col items-center gap-1 p-2 text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="h-16" />
      <div className="h-16 lg:hidden" />
    </>
  );
};

export default Navbar;
