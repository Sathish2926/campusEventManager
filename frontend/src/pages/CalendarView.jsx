import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEventDetailsPath } from '../utils/routeHelpers';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';

const CalendarView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getEventsForDay = (day) => events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getDate() === day && eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
  });

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) {
      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
      });
    }

    return getEventsForDay(selectedDate.getDate());
  }, [currentDate, events, selectedDate]);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setActiveTab('list');
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Calendar</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Plan your schedule</p>
        </div>
        
        <div className="flex rounded-lg border border-slate-100 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'calendar' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
          >
            <CalendarIcon size={16} /> Calendar
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'}`}
          >
             <List size={16} /> List View
          </button>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950/40">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{monthName} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="rounded-lg bg-white p-2 shadow-sm transition-colors hover:text-primary dark:bg-slate-900 dark:text-slate-300">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="rounded-lg bg-white p-2 shadow-sm transition-colors hover:text-primary dark:bg-slate-900 dark:text-slate-300">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-2 grid grid-cols-7 gap-px text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 rounded-xl bg-slate-50/50 sm:h-32 dark:bg-slate-950/40" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <div 
                    key={day} 
                    onClick={() => handleDayClick(day)}
                    className={`
                      h-24 sm:h-32 p-2 rounded-xl border transition-all duration-200 flex flex-col
                      ${hasEvents ? 'cursor-pointer hover:border-primary/50 bg-white dark:bg-slate-950/70 dark:border-slate-800' : 'bg-slate-50/50 border-transparent dark:bg-slate-950/40'}
                    `}
                  >
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1
                      ${hasEvents ? 'bg-primary/10 text-primary' : 'text-slate-400'}
                    `}>
                      {day}
                    </span>
                    
                    <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
                      {dayEvents.map(e => (
                         <button
                           key={e.id}
                           onClick={(event) => {
                             event.stopPropagation();
                             navigate(getEventDetailsPath(user.role, e.id));
                           }}
                           className="block w-full truncate rounded bg-secondary/10 px-1.5 py-0.5 text-left text-[10px] text-secondary transition-colors hover:bg-secondary/20 sm:text-xs"
                         >
                           {e.title}
                         </button>
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
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Events on {selectedDate ? `${monthName} ${selectedDate.getDate()}, ${year}` : `${monthName} ${year}`}
            </h3>
            {selectedDate ? (
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-sm text-primary font-medium hover:underline"
              >
                Clear Day Selection
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={prevMonth} className="rounded-lg bg-white p-2 shadow-sm transition-colors hover:text-primary dark:bg-slate-900 dark:text-slate-300">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextMonth} className="rounded-lg bg-white p-2 shadow-sm transition-colors hover:text-primary dark:bg-slate-900 dark:text-slate-300">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {eventsForSelectedDate.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {eventsForSelectedDate.map((event) => (
                <EventCard key={event.id} event={event} to={getEventDetailsPath(user.role, event.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 bg-white py-20 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <CalendarIcon className="mx-auto mb-4 text-slate-300" size={48} />
              <h3 className="text-xl font-medium text-slate-700 dark:text-slate-100">No events found</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Looks like there are no events scheduled for this period.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
