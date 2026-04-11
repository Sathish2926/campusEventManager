import React, { useState } from 'react';
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import EventCard from '../components/EventCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { MOCK_EVENTS, CATEGORIES } from '../data/mockData';

const EventListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const eventDate = new Date(event.date);
    
    // Reset time for accurate date-only comparison
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    
    let matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    
    let matchesDate = true;
    
    if (fromDate) {
       const [fYear, fMonth, fDay] = fromDate.split('-');
       const fromD = new Date(fYear, parseInt(fMonth) - 1, fDay);
       if (eventDateOnly < fromD) matchesDate = false;
    }
    
    if (toDate && matchesDate) {
       const [tYear, tMonth, tDay] = toDate.split('-');
       const toD = new Date(tYear, parseInt(tMonth) - 1, tDay);
       if (eventDateOnly > toD) matchesDate = false;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">All Events</h1>
          <p className="text-slate-500 mt-1">Discover what's happening around campus</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-soft mb-8 border border-slate-100 flex flex-col gap-6">
        
        {/* Search & Categories */}
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

        {/* Date Filters */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
           <div className="flex items-center gap-2 text-slate-600 font-medium whitespace-nowrap">
             <CalendarIcon size={18} className="text-primary"/>
             Filter by Date:
           </div>
           <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <Input 
                type="date"
                label="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <Input 
                type="date"
                label="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
           </div>
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
          <Filter className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-700">No events found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default EventListing;
