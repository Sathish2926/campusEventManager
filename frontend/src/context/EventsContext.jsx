import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiRequest } from '../utils/api';
import { useAuth } from './AuthContext';

const EventsContext = createContext(null);

const mapEventFromApi = (event) => ({
  id: event._id,
  title: event.title,
  date: event.date,
  venue: event.venue,
  description: event.description,
  category: event.category,
  image: event.mainImage || event.thumbnailImage,
  isRSVPd: false,
  status: event.status,
  rsvpCount: event.rsvpCount || 0,
});

export const EventsProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const refreshMyEvents = useCallback(async () => {
    if (!token || !user || user.role !== 'student') {
      setMyEvents([]);
      return;
    }
    try {
      const rsvps = await apiRequest(`/rsvps/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mapped = rsvps
        .filter((r) => r.eventId && r.status === 'attending')
        .map((r) => ({
          ...mapEventFromApi(r.eventId),
          isRSVPd: true,
        }));
      setMyEvents(mapped);
    } catch {
      setMyEvents([]);
    }
  }, [token, user]);

  const refreshEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const endpoint = token ? '/events' : '/events/public';
      const payload = await apiRequest(endpoint, token ? {
        headers: { Authorization: `Bearer ${token}` },
      } : {});
      if (Array.isArray(payload)) {
        setEvents(payload.map(mapEventFromApi));
      } else {
        setEvents([]);
      }
    } catch {
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, [token]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  useEffect(() => {
    refreshMyEvents();
  }, [refreshMyEvents]);

  const addEvent = async (payload) => {
    if (!token) throw new Error('Please login to create events');

    const newEvent = await apiRequest('/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...payload,
        mainImage: payload.image,
        thumbnailImage: payload.image,
      }),
    });
    
    await refreshEvents();
    return mapEventFromApi(newEvent);
  };

  const toggleRSVP = async (eventId, isRSVPd) => {
    if (!token) throw new Error('Please login to RSVP');

    const method = isRSVPd ? 'PATCH' : 'POST';
    const path = isRSVPd ? `/rsvps/${eventId}/cancel` : '/rsvps';

    await apiRequest(path, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId }),
    });

    await Promise.all([refreshEvents(), refreshMyEvents()]);
  };

  const fetchMyRsvps = async (userId) => {
    
    if (!token) return [];
    const rsvps = await apiRequest(`/rsvps/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return rsvps.filter(r => r.eventId && r.status === 'attending').map(r => ({
      ...mapEventFromApi(r.eventId),
      isRSVPd: true
    }));
  };

  const fetchOrganizerEvents = async (organizerId) => {
    if (!token) return [];
    const payload = await apiRequest(`/events?organizerId=${organizerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return payload.map(mapEventFromApi);
  };

  const fetchEventAttendance = async (eventId) => {
    if (!token) return [];
    const [rsvps, attendance] = await Promise.all([
      apiRequest(`/rsvps/event/${eventId}`, { headers: { Authorization: `Bearer ${token}` } }),
      apiRequest(`/attendance/event/${eventId}`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    return rsvps.map((r) => {
      const attend = attendance.find((a) => String(a.userId._id) === String(r.userId._id));
      return {
        id: r.userId._id,
        name: r.userId.name,
        email: r.userId.email,
        present: attend ? attend.status === 'present' : false,
      };
    });
  };

  const markAttendance = async (eventId, userId, status) => {
    if (!token) return;
    return apiRequest('/attendance', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId, userId, status }),
    });
  };

  const value = useMemo(
    () => ({
      events,
      myEvents,
      loadingEvents,
      addEvent,
      refreshEvents,
      refreshMyEvents,
      toggleRSVP,
      fetchMyRsvps,
      fetchOrganizerEvents,
      fetchEventAttendance,
      markAttendance,
    }),
    [events, myEvents, loadingEvents, refreshEvents, refreshMyEvents, token]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents must be used within EventsProvider');
  return context;
};