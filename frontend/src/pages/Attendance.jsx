import React, { useState, useEffect } from 'react';
import Input from '../components/ui/Input';
import { Search, CheckCircle2, Circle } from 'lucide-react';
import { MOCK_EVENTS } from '../data/mockData';

// Expand mock attendees to include eventId to demonstrate dynamic filtering
const MOCK_ATTENDEES = [
  { id: 1, eventId: 1, name: "Alice Johnson", email: "alice.j@student.edu", present: true },
  { id: 2, eventId: 1, name: "Bob Smith", email: "b.smith@student.edu", present: false },
  { id: 3, eventId: 1, name: "Charlie Davis", email: "charlie.d@student.edu", present: true },
  { id: 4, eventId: 2, name: "Diana Prince", email: "d.prince@student.edu", present: false },
  { id: 5, eventId: 2, name: "Evan Wright", email: "evan.w@student.edu", present: false },
  { id: 6, eventId: 3, name: "Fiona Apple", email: "f.apple@student.edu", present: true },
  { id: 7, eventId: 3, name: "George Harrison", email: "g.harrison@student.edu", present: false },
  { id: 8, eventId: 3, name: "Hannah Abbott", email: "h.abbott@student.edu", present: true },
];

const Attendance = () => {
  const [attendees, setAttendees] = useState(MOCK_ATTENDEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0].id);

  const toggleAttendance = (id) => {
    setAttendees(attendees.map(a => 
      a.id === id ? { ...a, present: !a.present } : a
    ));
  };

  const filteredAttendees = attendees.filter(a => {
    const matchesEvent = a.eventId === selectedEventId;
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Attendance</h1>
        <p className="text-slate-500 mt-1">Manage event check-ins</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="w-full md:w-64">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Select Event</label>
            <select 
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none text-sm font-medium"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
            >
              {MOCK_EVENTS.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div className="w-full md:w-72 relative">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block opacity-0 hidden md:block">Search</label>
            <Search className="absolute left-3 top-[calc(50%+2px)] transform -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 !py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Attendee Info</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{attendee.name}</p>
                        <p className="text-xs text-slate-500">{attendee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      attendee.present ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {attendee.present ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      {attendee.present ? 'Checked In' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleAttendance(attendee.id)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                        attendee.present 
                          ? 'border-slate-200 text-slate-600 hover:bg-slate-100' 
                          : 'border-primary text-primary hover:bg-primary/5'
                      }`}
                    >
                      {attendee.present ? 'Revoke Check-In' : 'Mark Present'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAttendees.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center border-t border-slate-50">
            <Circle className="text-slate-300 mb-3" size={32} />
            <h3 className="text-lg font-medium text-slate-700">No attendees found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">No registered attendees match your criteria for this event.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
