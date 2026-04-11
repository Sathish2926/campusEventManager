import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const RoleLayout = () => {
  return (
    <div className="min-h-screen bg-background text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="pt-4 pb-20 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RoleLayout;