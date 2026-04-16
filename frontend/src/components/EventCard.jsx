import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';

const EventCard = ({ event, to }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <Link to={to || `/student/events/${event.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-hover transition-all duration-300 border border-slate-100 flex flex-col h-full transform group-hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm flex items-center gap-1 dark:bg-slate-950/90 dark:text-sky-300">
             <Tag size={12} />
             {event.category}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-primary transition-colors dark:text-slate-100">
            {event.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 dark:text-slate-300">
            <Calendar size={16} className="text-secondary" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 dark:text-slate-300">
            <MapPin size={16} className="text-secondary" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center dark:border-slate-800">
            <span className={`text-xs font-bold px-2 py-1 uppercase tracking-wider rounded-md ${
              event.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' : 
              event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300' : 
              event.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' :
              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
            }`}>
              {event.status}
            </span>
            {event.isRSVPd && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md dark:bg-primary/20 dark:text-sky-300">
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
