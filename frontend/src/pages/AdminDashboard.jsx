import React from 'react';
import { BadgeCheck, Users, ShieldAlert } from 'lucide-react';

const pendingEvents = [
  { id: 1, title: 'Innovation Summit', status: 'Pending approval' },
  { id: 2, title: 'Campus Music Night', status: 'Pending approval' },
  { id: 3, title: 'Sports Fest', status: 'Pending approval' },
];

const users = [
  { id: 1, name: 'Asha Rao', role: 'Student' },
  { id: 2, name: 'Daniel Jose', role: 'Organizer' },
  { id: 3, name: 'Priya Shah', role: 'Student' },
];

const AdminDashboard = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Manage approvals and users</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">A simple overview for moderation and basic admin work.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <BadgeCheck className="text-primary" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Approve Events</h2>
          </div>
          <div className="mt-5 space-y-3">
            {pendingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{event.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.status}</p>
                </div>
                <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white">
                  Review
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Users className="text-primary" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Manage Users</h2>
          </div>
          <div className="mt-5 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
                <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200">
                  View
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-primary" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">System Notes</h2>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          This dashboard stays intentionally simple for a student project while still keeping approvals and user management visible.
        </p>
      </section>
    </div>
  );
};

export default AdminDashboard;