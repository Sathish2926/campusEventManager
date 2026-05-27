import React, { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, Filter, Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getEventDetailsPath } from '../utils/routeHelpers';
import { useEvents } from '../context/EventsContext';

const EventListing = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateMode, setDateMode] = useState('range');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exactDate, setExactDate] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? event.category === selectedCategory : true;

      let matchesDate = true;

      if (dateMode === 'range') {
        if (fromDate) {
          const fromD = new Date(`${fromDate}T00:00:00`);
          if (eventDateOnly < fromD) {
            matchesDate = false;
          }
        }

        if (toDate && matchesDate) {
          const toD = new Date(`${toDate}T23:59:59`);
          if (eventDateOnly > toD) {
            matchesDate = false;
          }
        }
      }

      if (dateMode === 'exact' && exactDate) {
        const targetDate = new Date(`${exactDate}T00:00:00`);
        matchesDate = eventDateOnly.getTime() === targetDate.getTime();
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [dateMode, events, exactDate, fromDate, searchTerm, selectedCategory, toDate]);

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">All Events</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Discover what's happening around campus</p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-6 rounded-xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input 
              placeholder="Search events, venues..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Button 
              variant={selectedCategory === '' ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory('')}
              className="whitespace-nowrap"
            >
              All
            </Button>
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'secondary'}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">
            <CalendarIcon size={18} className="text-primary" />
            Date Filter
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col gap-1.5 sm:w-48">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Mode</label>
              <select
                value={dateMode}
                onChange={(event) => setDateMode(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="range">From / To</option>
                <option value="exact">On Date</option>
              </select>
            </div>

            {dateMode === 'range' ? (
              <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                <Input label="From Date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
                <Input label="To Date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
              </div>
            ) : (
              <Input label="On Date" type="date" value={exactDate} onChange={(event) => setExactDate(event.target.value)} className="sm:max-w-sm" />
            )}
          </div>
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
          <Filter className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-700 dark:text-slate-100">No events found</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default EventListing;
