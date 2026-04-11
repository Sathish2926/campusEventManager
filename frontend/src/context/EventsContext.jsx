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

  const value = useMemo(
    () => ({
      events,
      loadingEvents,
      addEvent,
      refreshEvents,
    }),
    [events, loadingEvents]
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