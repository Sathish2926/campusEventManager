import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarDays, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import EventCard from '../components/EventCard';
import { getEventDetailsPath } from '../utils/routeHelpers';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';

const DashboardCard = ({ title, value, icon, trend }) => (
  <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft transition-colors dark:border-slate-800 dark:bg-slate-900">
    <div className="flex justify-between items-start mb-4">
      <div className="rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      {trend && (
        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-500/10 dark:text-green-300">
          <ArrowUpRight size={14} />
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
      <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchOrganizerEvents } = useEvents();
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    if (user) {
      setLoading(true);
      fetchOrganizerEvents(user.id).then((data) => {
        setOrganizerEvents(data);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const stats = {
    totalEvents: organizerEvents.length,
    activeEvents: organizerEvents.filter(e => e.status === 'upcoming').length,
    totalRsvps: organizerEvents.reduce((acc, curr) => acc + (curr.rsvpCount || 0), 0)
  };

  const recentEvents = organizerEvents.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Organizer</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100 italic">Welcome back, {user?.name?.split(' ')[0] || 'Organizer'}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Keep track of created events and attendance from one place.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/organizer/attendance')}>
            View Attendance
          </Button>
          <Button onClick={() => navigate('/organizer/create')}>
            Create Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 mb-8">
        <DashboardCard 
          title="Events Created" 
          value={String(stats.totalEvents)} 
          icon={<CalendarDays size={24} />} 
          trend={stats.activeEvents > 0 ? `+${stats.activeEvents} active` : 'No active'}
        />
        <DashboardCard 
          title="Total RSVPs" 
          value={String(stats.totalRsvps)} 
          icon={<Users size={24} />} 
          trend={stats.totalRsvps > 100 ? "Popular!" : ""}
        />
        <DashboardCard 
          title="Database Actions" 
          value={loading ? "..." : "Online"} 
          icon={<Sparkles size={24} />} 
        />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Button onClick={() => navigate('/organizer/create')} className="justify-center">
          Create Event
        </Button>
        <Button variant="secondary" onClick={() => navigate('/organizer/attendance')} className="justify-center">
          View Attendance
        </Button>
        <Button variant="secondary" onClick={() => navigate('/organizer/profile')} className="justify-center">
          Edit Profile
        </Button>
        <Button variant="secondary" onClick={refreshData} className="justify-center">
          Refresh Dashboard
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/40">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your Managed Events</h2>
          <button 
            onClick={() => navigate('/organizer/create')}
            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Create New
          </button>
        </div>
        
        {loading ? (
           <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
           </div>
        ) : organizerEvents.length > 0 ? (
          <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-4">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} to={getEventDetailsPath('organizer', event.id)} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
             <p className="text-slate-500">You haven't created any events yet.</p>
             <Button variant="ghost" className="mt-4" onClick={() => navigate('/organizer/create')}>Start Creating</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
