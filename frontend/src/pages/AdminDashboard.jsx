import React, { useEffect, useState } from 'react';
import { BadgeCheck, Users, ShieldAlert, Trash2, Edit, CheckCircle, XCircle, Shield, Ban, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, token: authToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, usersRes] = await Promise.all([
        fetch('/api/events', {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        fetch('/api/users', {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);
      const eventData = await eventsRes.json();
      const userData = await usersRes.json();
      if (!eventsRes.ok) throw new Error(eventData.message);
      if (!usersRes.ok) throw new Error(userData.message);
      
      setEvents(Array.isArray(eventData) ? eventData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      toast.error("Failed to load dashboard data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEventStatus = async (eventId, status) => {
    try {
      const res = await fetch(`/api/events/${eventId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Event ${status} successfully`);
      setEvents(prev => prev.map(e => e._id === eventId ? { ...e, status } : e));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Failed to delete event');
      toast.success("Event deleted permanently.");
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditEventPrompt = async (event) => {
    const newTitle = window.prompt("Enter new title for the event:", event.title);
    if (!newTitle || newTitle === event.title) return;
    
    try {
      const res = await fetch(`/api/events/${event._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      if (!res.ok) throw new Error('Failed to edit event');
      toast.success("Event updated successfully.");
      setEvents(prev => prev.map(e => e._id === event._id ? { ...e, title: newTitle } : e));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`User role updated to ${newRole}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleBlock = async (userId, currentBlockStatus) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ isBlocked: !currentBlockStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`User has been ${!currentBlockStatus ? 'blocked' : 'unblocked'}`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !currentBlockStatus } : u));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? All their RSVPs will be orphaned.")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("User deleted successfully.");
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">System Dashboard</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Manage all content, resolve pending approvals, and moderate users.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <BadgeCheck className="text-primary" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Events Management</h2>
          </div>
          <div className="mt-5 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center p-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>
            ) : events.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No events found in the database.</p>
            ) : events.map((event) => (
              <div key={event._id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-primary/30 dark:border-slate-800 dark:hover:border-primary/50">
                <div className="mb-4 sm:mb-0">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {event.title}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    By: {event.organizerName} | Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {event.status === 'pending' && (
                    <>
                      <button onClick={() => handleEventStatus(event._id, 'approved')} className="flex items-center justify-center gap-1 rounded bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600">
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleEventStatus(event._id, 'rejected')} className="flex items-center justify-center gap-1 rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600">
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  )}
                  {event.status === 'rejected' && (
                    <button onClick={() => handleEventStatus(event._id, 'approved')} className="flex items-center justify-center gap-1 rounded bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600">
                      <CheckCircle size={14} /> Re-Approve
                    </button>
                  )}
                  {event.status === 'approved' && (
                    <button onClick={() => handleEventStatus(event._id, 'rejected')} className="flex items-center justify-center gap-1 rounded bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                      <XCircle size={14} /> Revoke
                    </button>
                  )}
                  <button onClick={() => handleEditEventPrompt(event)} className="flex items-center justify-center gap-1 rounded border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDeleteEvent(event._id)} className="flex items-center justify-center gap-1 rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/50">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <Users className="text-primary" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">User Moderation</h2>
          </div>
          <div className="mt-5 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center p-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>
            ) : users.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No users found.</p>
            ) : users.map((u) => (
              <div key={u._id} className="flex flex-col lg:flex-row lg:items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-600">
                <div className="mb-4 lg:mb-0">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {u.name}
                    {u.role === 'admin' && <Shield size={14} className="text-primary" />}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isBlocked ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {u.isBlocked ? 'Blocked' : u.role}
                    </span>
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{u.email}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {u.role === 'student' && (
                    <button onClick={() => handleUserRole(u._id, 'organizer')} className="rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                      Promote to Organizer
                    </button>
                  )}
                  {u.role === 'organizer' && (
                    <button onClick={() => handleUserRole(u._id, 'student')} className="rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                      Demote to Student
                    </button>
                  )}
                  
                  {u._id !== user.id && (
                    <>
                      <button onClick={() => handleToggleBlock(u._id, u.isBlocked)} className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold transition ${u.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30'}`}>
                        {u.isBlocked ? <><Check size={14} /> Unblock</> : <><Ban size={14} /> Block</>}
                      </button>
                      <button onClick={() => handleDeleteUser(u._id)} className="flex items-center justify-center gap-1 rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/50">
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;