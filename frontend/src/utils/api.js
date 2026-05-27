import toast from 'react-hot-toast';

const API_BASE_URL = '/api';

const readErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    return payload.message || 'Request failed';
  } catch {
    return 'Request failed';
  }
};

export const apiRequest = async (path, options = {}) => {
  const { headers: customHeaders, ...restOptions } = options;

  // Only auto-inject from localStorage if the caller hasn't already provided a token
  const callerHasToken = customHeaders?.Authorization?.startsWith('Bearer ');
  const storedToken = localStorage.getItem('campus_event_manager_token');
  const effectiveToken = callerHasToken ? null : storedToken;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
      ...(customHeaders || {}),
    },
    ...restOptions,
  });

  if (response.status === 401) {
    const isAuthEndpoint = path.includes('/login') || path.includes('/signup');
    const onAuthPage =
      window.location.pathname.includes('/login') ||
      window.location.pathname.includes('/signup');

    // Always let auth endpoints surface their own errors (wrong password etc.)
    if (isAuthEndpoint) {
      const errorMessage = await readErrorMessage(response);
      throw new Error(errorMessage);
    }

    // Determine if a real token existed (not just an empty string / undefined)
    const hadRealToken = Boolean(storedToken) || callerHasToken;

    // Clear stale tokens
    localStorage.removeItem('campus_event_manager_token');
    localStorage.removeItem('campus_event_manager_auth');

    // Only toast + redirect if the user was on a protected page AND had a token
    if (!onAuthPage && hadRealToken) {
      toast.error('Session expired. Please login again.');
      window.dispatchEvent(new Event('auth:logout'));
    }

    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorMessage = await readErrorMessage(response);
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};