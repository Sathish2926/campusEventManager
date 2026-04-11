export const getHomePath = (role) => {
  if (role === 'organizer') {
    return '/organizer';
  }

  if (role === 'admin') {
    return '/admin';
  }

  return '/student';
};

export const getEventDetailsPath = (role, eventId) => {
  if (role === 'organizer') {
    return `/organizer/attendance/${eventId}`;
  }

  return `/student/events/${eventId}`;
};