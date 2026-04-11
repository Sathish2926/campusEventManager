import React from 'react';
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
  const { events } = useEvents();
  const createdEvents = events.filter((event) => event.status === 'upcoming').slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Organizer</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back, {user?.name?.split(' ')[0] || 'Organizer'}</h1>
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
          title="Created Events" 
          value={String(events.length)} 
          icon={<CalendarDays size={24} />} 
          trend="+2 this month"
        />
        <DashboardCard 
          title="Attendance Marked" 
          value="1,458" 
          icon={<Users size={24} />} 
          trend="+12%"
        />
        <DashboardCard 
          title="Quick Actions Used" 
          value="38" 
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
        <Button variant="secondary" onClick={() => navigate('/organizer')} className="justify-center">
          Refresh Dashboard
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/40">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Created Events</h2>
          <button 
            onClick={() => navigate('/organizer/create')}
            className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Create New
          </button>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-4">
          {createdEvents.map((event) => (
            <EventCard key={event.id} event={event} to={getEventDetailsPath('organizer', event.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
