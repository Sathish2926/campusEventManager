import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Button from '../components/ui/Button';
import { MOCK_EVENTS } from '../data/mockData';
import { BookmarkMinus } from 'lucide-react';
import { getEventDetailsPath } from '../utils/routeHelpers';
import { useAuth } from '../context/AuthContext';

const MyEvents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const myEvents = MOCK_EVENTS.filter(e => e.isRSVPd);
  const [filter, setFilter] = useState('upcoming');

  const filteredEvents = myEvents.filter(e => filter === 'all' || e.status === filter);

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Events</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your registered events</p>
        </div>
        
        <div className="flex rounded-lg border border-slate-100 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button 
            onClick={() => setFilter('all')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
          >
            Past
          </button>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} to={getEventDetailsPath(user.role, event.id)} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-white py-20 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <BookmarkMinus className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-700 dark:text-slate-100">No events found</h3>
          <p className="mt-2 mb-6 text-slate-500 dark:text-slate-400">You haven't registered for any {filter !== 'all' ? filter : ''} events yet.</p>
          <Button onClick={() => navigate('/student/events')}>Browse Events</Button>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
