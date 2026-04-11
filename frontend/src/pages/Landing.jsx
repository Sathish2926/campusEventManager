import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import EventCard from '../components/EventCard';
import { MOCK_EVENTS } from '../data/mockData';

const Landing = () => {
  const navigate = useNavigate();
  const upcomingEvents = MOCK_EVENTS.filter(e => e.status === 'upcoming').slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight mb-6">
            Discover Student <br className="hidden lg:block"/>
            Events on <span className="text-gradient">Campus</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
            Never miss an important event again. Find hackathons, concerts, club meetings, and career fairs all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button onClick={() => navigate('/events')} className="w-full sm:w-auto text-lg px-8 py-3">
              Explore Events
            </Button>
            <Button variant="secondary" onClick={() => navigate('/my-events')} className="w-full sm:w-auto text-lg px-8 py-3">
              View My Tickets
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <div className="relative rounded-2xl overflow-hidden shadow-soft aspect-[4/3] transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80" 
              alt="Students gathering" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white text-2xl font-bold">Vibrant Campus Life</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
          <Button variant="ghost" onClick={() => navigate('/events')} className="hidden sm:flex text-slate-600 hover:text-primary">
            View all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Button variant="secondary" onClick={() => navigate('/events')} className="w-full">
            View all events
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
