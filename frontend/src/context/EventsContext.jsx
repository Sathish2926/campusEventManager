import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_EVENTS } from '../data/mockData';
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
});

export const EventsProvider = ({ children }) => {
  const { token } = useAuth();
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const refreshEvents = async () => {
    setLoadingEvents(true);
    try {
      const payload = await apiRequest('/events');

      if (!Array.isArray(payload)) {
        setEvents(MOCK_EVENTS);
      } else {
        setEvents(payload.map(mapEventFromApi));
      }
    } catch {
      setEvents(MOCK_EVENTS);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const addEvent = (payload) => {
    if (!token) {
      throw new Error('Please login to create events');
    }

    return apiRequest('/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
        date: payload.date,
        time: payload.time,
        venue: payload.venue,
        category: payload.category,
        mainImage: payload.image,
        thumbnailImage: payload.image,
      }),
    }).then((newEvent) => {
      const mappedEvent = mapEventFromApi(newEvent);
      setEvents((currentEvents) => [mappedEvent, ...currentEvents]);
      return mappedEvent;
    });
  };

  const toggleRSVP = (eventId, isRSVPd) => {
    if (!token) {
      throw new Error('Please login to RSVP');
    }

    const method = isRSVPd ? 'PATCH' : 'POST';
    const path = isRSVPd ? `/rsvps/${eventId}/cancel` : '/rsvps';

    return apiRequest(path, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId }),
    }).then(() => refreshEvents());
  };

  const fetchMyRsvps = async (userId) => {
    if (!token) return [];
    try {
      const rsvps = await apiRequest(`/rsvps/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return rsvps.map((r) => ({
        ...mapEventFromApi(r.eventId),
        isRSVPd: r.status === 'attending',
      }));
    } catch {
      return [];
    }
  };

  const fetchOrganizerEvents = async (organizerId) => {
    if (!token) return [];
    try {
      const payload = await apiRequest(`/events?organizerId=${organizerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return payload.map(mapEventFromApi);
    } catch {
      return [];
    }
  };

  const fetchEventAttendance = async (eventId) => {
    if (!token) return [];
    try {
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
    } catch {
      return [];
    }
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
      loadingEvents,
      addEvent,
      refreshEvents,
      toggleRSVP,
      fetchMyRsvps,
      fetchOrganizerEvents,
      fetchEventAttendance,
      markAttendance,
    }),
    [events, loadingEvents, token]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }

  return context;
};