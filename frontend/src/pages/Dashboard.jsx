import React from 'react';
import { MOCK_EVENTS } from '../data/mockData';
import { BarChart3, Users, Star, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 text-primary rounded-lg">
        {icon}
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <ArrowUpRight size={14} />
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Total Events" 
          value="12" 
          icon={<BarChart3 size={24} />} 
          trend="+2 this month"
        />
        <DashboardCard 
          title="Total Attendees" 
          value="1,458" 
          icon={<Users size={24} />} 
          trend="+12%"
        />
        <DashboardCard 
          title="Avg. Rating" 
          value="4.8/5" 
          icon={<Star size={24} />} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Recent Events</h2>
          <button 
            onClick={() => navigate('/organizer/create')}
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Create New
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_EVENTS.slice(0, 4).map((event) => (
            <div key={event.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} alt={event.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-slate-700">124 RSVPs</p>
                <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
