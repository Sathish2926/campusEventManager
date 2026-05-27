import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../components/ui/Input';
import { Search, CheckCircle2, Circle, CalendarDays, Users } from 'lucide-react';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { fetchOrganizerEvents, fetchEventAttendance, markAttendance } = useEvents();
  
  const [attendees, setAttendees] = useState([]);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (user) {
      fetchOrganizerEvents(user.id).then(data => {
        setOrganizerEvents(data);
        if (!selectedEventId && data.length > 0) {
          setSelectedEventId(String(data[0].id));
        }
      });
    }
  }, [user, fetchOrganizerEvents]);

  
  useEffect(() => {
    if (selectedEventId) {
      setLoading(true);
      fetchEventAttendance(selectedEventId).then(data => {
        setAttendees(data);
        setLoading(false);
      });
    }
  }, [selectedEventId, fetchEventAttendance]);

  const handleToggleAttendance = async (userId, currentStatus) => {
    const newStatus = currentStatus ? 'absent' : 'present';
    try {
      await markAttendance(selectedEventId, userId, newStatus);
      
      setAttendees(prev => prev.map(a => a.id === userId ? { ...a, present: !currentStatus } : a));
    } catch (err) {
      alert("Failed to update attendance: " + err.message);
    }
  };

  const filteredAttendees = attendees.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const selectedEvent = organizerEvents.find((e) => String(e.id) === String(selectedEventId));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Attendance Tracker</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Manage real-time campus check-ins</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 min-h-[400px] flex flex-col">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50 p-6 md:flex-row md:items-center dark:border-slate-800 dark:bg-slate-950/40">
          <div className="w-full md:w-64">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Managed Event</label>
            <select 
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="" disabled>Select an event...</option>
              {organizerEvents.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div className="w-full md:w-72 relative">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500 opacity-0 hidden md:block dark:text-slate-400">Search</label>
            <Search className="absolute left-3 top-[calc(50%+2px)] transform -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 !py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
           <div className="flex-1 flex items-center justify-center p-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
           </div>
        ) : organizerEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
             <CalendarDays className="text-slate-200 mb-4" size={64} />
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No events found</h3>
             <p className="text-slate-500">You need to create an event before tracking attendance.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 bg-primary/5 text-sm text-primary font-medium border-b border-slate-100 dark:border-slate-800">
               Tracking for: <span className="font-bold underline italic mx-1">{selectedEvent?.title || 'Unknown Event'}</span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-white text-xs uppercase tracking-widest text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                    <th className="px-6 py-4 font-semibold">Student Details</th>
                    <th className="px-6 py-4 font-semibold">Live Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Database Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee.id} className="group transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-950/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                            {attendee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{attendee.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{attendee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          attendee.present ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {attendee.present ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                          {attendee.present ? 'Checked In' : 'Not Present'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleToggleAttendance(attendee.id, attendee.present)}
                          className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all ${
                            attendee.present 
                              ? 'border-slate-200 text-slate-600 hover:bg-slate-100' 
                              : 'border-primary text-primary hover:bg-primary/5 shadow-sm'
                          }`}
                        >
                          {attendee.present ? 'Revoke' : 'Check In'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAttendees.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Users className="text-slate-200 mb-3" size={48} />
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-100">No registrations found</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">Students need to RSVP before they appear in the attendance list.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
