import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, CheckCircle2, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events } = useEvents();
  const event = events.find((item) => String(item.id) === String(id)) || events[0];
  
  const [isRSVPd, setIsRSVPd] = useState(event?.isRSVPd);
  const [rsvpCount, setRsvpCount] = useState(124 + (event?.isRSVPd ? 1 : 0));

  if (!event) {
    return null;
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });

  const toggleRSVP = () => {
    if (isRSVPd) {
      setRsvpCount(prev => prev - 1);
    } else {
      setRsvpCount(prev => prev + 1);
    }
    setIsRSVPd(!isRSVPd);
  };

  return (
    <div className="min-h-screen bg-background pb-12 dark:bg-slate-950">
      <div className="relative h-64 md:h-80 lg:h-96 w-full">
        <img 
          src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 sm:left-6 lg:left-8 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <span className="inline-block px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-3">
            {event.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100 mb-8 dark:bg-slate-900 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 dark:text-slate-100">About This Event</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap dark:text-slate-300">
              {event.description}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Event Details</h3>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  <Users size={14} className={isRSVPd ? "text-primary" : ""} />
                  {rsvpCount} Attending
                </div>
             </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary dark:bg-secondary/20">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{formattedDate}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Date</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary dark:bg-secondary/20">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{formattedTime}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Time</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary dark:bg-secondary/20">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{event.venue}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
              {event.status === 'completed' ? (
                <Button className="w-full opacity-50 cursor-not-allowed" disabled>
                  Event Ended
                </Button>
              ) : user?.role === 'organizer' ? (
                <Button className="w-full" onClick={() => navigate(`/organizer/attendance/${event.id}`)}>
                  View Attendance
                </Button>
              ) : (
                <Button 
                  className="w-full flex justify-center items-center gap-2"
                  variant={isRSVPd ? 'secondary' : 'primary'}
                  onClick={toggleRSVP}
                >
                  {isRSVPd ? (
                    <>
                      <CheckCircle2 size={20} className="text-green-500" />
                      RSVP Confirmed
                    </>
                  ) : (
                    'RSVP Now'
                  )}
                </Button>
              )}
            </div>
          </div>
          
          <Button variant="ghost" className="w-full flex justify-center items-center gap-2 text-slate-500">
            <Share2 size={18} />
            Share Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
