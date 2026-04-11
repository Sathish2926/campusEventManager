import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, LayoutGrid, Tickets } from 'lucide-react';
import Button from '../components/ui/Button';
import EventCard from '../components/EventCard';
import { getEventDetailsPath } from '../utils/routeHelpers';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';

const StudentLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvents();
  const upcomingEvents = events.filter((event) => event.status === 'upcoming').slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Student Landing</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome, {user?.name?.split(' ')[0] || 'Student'}</h1>
            <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">Browse upcoming events, jump into the calendar, and check your registrations.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
            <Button onClick={() => navigate('/student/calendar')} className="justify-center">
              Calendar
            </Button>
            <Button variant="secondary" onClick={() => navigate('/student/my-events')} className="justify-center">
              My Events
            </Button>
            <Button variant="secondary" onClick={() => navigate('/student/events')} className="justify-center">
              Browse Events
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <CalendarDays className="text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Calendar Access</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Jump to month and list views without leaving the student area.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <Tickets className="text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">My Events</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Review the events you have already RSVP’d to.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <LayoutGrid className="text-primary" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Simple Navigation</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No organizer tabs, no clutter, only student tools.</p>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Upcoming Events</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Tap any card to open the event details.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/student/events')}>
            View all
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} to={getEventDetailsPath('student', event.id)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentLanding;