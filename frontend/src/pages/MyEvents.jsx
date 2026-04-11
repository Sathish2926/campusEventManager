import React, { useState } from 'react';
import EventCard from '../components/EventCard';
import Button from '../components/ui/Button';
import { MOCK_EVENTS } from '../data/mockData';
import { BookmarkMinus } from 'lucide-react';

const MyEvents = () => {
  const myEvents = MOCK_EVENTS.filter(e => e.isRSVPd);
  const [filter, setFilter] = useState('upcoming'); // 'all', 'upcoming', 'completed'

  const filteredEvents = myEvents.filter(e => filter === 'all' || e.status === filter);

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Tickets</h1>
          <p className="text-slate-500 mt-1">Manage your registered events</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-100">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'upcoming' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'completed' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Past
          </button>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-100 shadow-soft">
          <BookmarkMinus className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-700">No events found</h3>
          <p className="text-slate-500 mt-2 mb-6">You haven't registered for any {filter !== 'all' ? filter : ''} events yet.</p>
          <Button onClick={() => window.location.href = '/events'}>Browse Events</Button>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
