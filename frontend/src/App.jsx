import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleLayout from './components/RoleLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentLanding from './pages/StudentLanding';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventListing from './pages/EventListing';
import EventDetails from './pages/EventDetails';
import CalendarView from './pages/CalendarView';
import MyEvents from './pages/MyEvents';
import CreateEvent from './pages/CreateEvent';
import Attendance from './pages/Attendance';
import EditProfile from './pages/EditProfile';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/${user.role}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/start" element={<HomeRedirect />} />

        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<RoleLayout />}>
            <Route path="/student" element={<StudentLanding />} />
            <Route path="/student/events" element={<EventListing />} />
            <Route path="/student/events/:id" element={<EventDetails />} />
            <Route path="/student/calendar" element={<CalendarView />} />
            <Route path="/student/my-events" element={<MyEvents />} />
            <Route path="/student/profile" element={<EditProfile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
          <Route element={<RoleLayout />}>
            <Route path="/organizer" element={<Dashboard />} />
            <Route path="/organizer/create" element={<CreateEvent />} />
            <Route path="/organizer/attendance/:eventId?" element={<Attendance />} />
            <Route path="/organizer/profile" element={<EditProfile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<RoleLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<EditProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
