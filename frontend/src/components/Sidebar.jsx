import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Users } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/organizer', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Create Event', path: '/organizer/create', icon: <PlusCircle size={20} /> },
    { name: 'Attendance', path: '/organizer/attendance', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-full shadow-soft z-10">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-800">Organizer Panel</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your events</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.exact}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
              ${isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Jane Doe</p>
            <p className="text-xs text-slate-500">Student Council</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
