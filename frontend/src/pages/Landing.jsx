import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { MOCK_EVENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getHomePath } from '../utils/routeHelpers';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const upcomingEvents = MOCK_EVENTS.filter((event) => event.status === 'upcoming').slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden bg-background dark:bg-slate-950">
      <section className="relative isolate px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.16),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.1),_transparent_40%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Campus Event Manager
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
              One place for campus events, RSVPs, and attendance.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A clean event hub for students, organizers, and admins to manage campus activity without extra clutter.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate('/login')} className="px-6 py-3 text-base">
                Login to Continue
              </Button>
              <Button variant="secondary" onClick={() => navigate('/signup')} className="px-6 py-3 text-base">
                Create Account
              </Button>
              {user && (
                <Button variant="secondary" onClick={() => navigate(getHomePath(user.role))} className="px-6 py-3 text-base">
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-primary opacity-20 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-soft-hover dark:border-slate-800 dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&q=80"
                alt="Students at an event"
                className="h-[420px] w-full object-cover"
              />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                  <span>Login to continue</span>
                  <span>{upcomingEvents.length} upcoming highlights</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{event.venue}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
