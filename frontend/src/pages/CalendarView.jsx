import React, { useState } from 'react';
import { MOCK_EVENTS } from '../data/mockData';
import EventCard from '../components/EventCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'list'
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const [selectedDay, setSelectedDay] = useState(null);

  const getEventsForDay = (day) => {
    return MOCK_EVENTS.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getDate() === day && 
             eDate.getMonth() === currentDate.getMonth() &&
             eDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Calendar</h1>
          <p className="text-slate-500 mt-1">Plan your schedule</p>
        </div>
        
        {/* Tab switch logic */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'calendar' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <CalendarIcon size={16} /> Calendar
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'list' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900'}`}
          >
             <List size={16} /> List View
          </button>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden mb-8">
          <div className="p-6 flex justify-between items-center bg-slate-50 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">{monthName} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg bg-white shadow-sm hover:text-primary transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-lg bg-white shadow-sm hover:text-primary transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 gap-px mb-2 text-center font-medium text-slate-500 text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 sm:h-32 bg-slate-50/50 rounded-xl" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => hasEvents && handleDayClick(day)}
                    className={`
                      h-24 sm:h-32 p-2 rounded-xl border transition-all duration-200 flex flex-col
                      ${hasEvents ? 'cursor-pointer hover:border-primary/50 bg-white' : 'bg-slate-50/50 border-transparent'}
                    `}
                  >
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1
                      ${hasEvents ? 'bg-primary/10 text-primary' : 'text-slate-400'}
                    `}>
                      {day}
                    </span>
                    
                    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
                      {dayEvents.map(e => (
                         <div key={e.id} className="text-[10px] sm:text-xs truncate bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">
                           {e.title}
                         </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 mb-8 flex justify-between items-center bg-slate-50">
            <h3 className="text-xl font-bold text-slate-800">
              Events on {selectedDay ? `${monthName} ${selectedDay}, ${year}` : `${monthName} ${year}`}
            </h3>
            {/* Minimal date navigation directly from list view */}
            {selectedDay === null && (
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-lg bg-white shadow-sm hover:text-primary transition-colors">
                  <ChevronLeft size={20} />
                </button>
                 <button onClick={nextMonth} className="p-2 rounded-lg bg-white shadow-sm hover:text-primary transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            {selectedDay !== null && (
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-sm text-primary font-medium hover:underline"
              >
                Clear Day Selection
              </button>
            )}
           </div>
          
           {(() => {
              const eventsToShow = selectedDay 
                 ? getEventsForDay(selectedDay) 
                 : MOCK_EVENTS.filter(e => {
                    const d = new Date(e.date);
                    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
                 });
                 
              return eventsToShow.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {eventsToShow.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-100 shadow-soft">
                  <CalendarIcon className="mx-auto text-slate-300 mb-4" size={48} />
                  <h3 className="text-xl font-medium text-slate-700">No events found</h3>
                  <p className="text-slate-500 mt-2">Looks like there are no events scheduled for this period.</p>
                </div>
              );
           })()}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
