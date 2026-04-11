import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-hover transition-all duration-300 border border-slate-100 flex flex-col h-full transform group-hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm flex items-center gap-1">
             <Tag size={12} />
             {event.category}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Calendar size={16} className="text-secondary" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <MapPin size={16} className="text-secondary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${
              event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            {event.isRSVPd && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                Registered
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
