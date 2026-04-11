import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import EventListing from './pages/EventListing';
import EventDetails from './pages/EventDetails';
import CalendarView from './pages/CalendarView';
import MyEvents from './pages/MyEvents';

import OrganizerLayout from './pages/OrganizerLayout';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Attendance from './pages/Attendance';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const StudentLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Student Routes */}
        <Route element={<StudentLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/events" element={<EventListing />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Route>

        {/* Organizer Routes */}
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateEvent />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
