import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const OrganizerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 transform lg:transform-none transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar />
      </div>

      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-4 py-4 lg:hidden flex items-center justify-between shadow-sm z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800">Organizer Panel</span>
          <div className="w-10"></div> 
        </header>

        <main className="flex-1 overflow-y-auto w-full">
          <div className="absolute top-4 right-4 z-40 hidden lg:block">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-slate-600 hover:text-primary transition-colors border border-slate-100 hover:border-primary/20"
            >
              <ArrowLeft size={16} />
              Return to Student View
            </button>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="lg:hidden mb-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
               >
                <ArrowLeft size={16} />
                Return to Student View
              </button>
            </div>
            
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
