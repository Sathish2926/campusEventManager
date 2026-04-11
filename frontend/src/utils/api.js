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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(customHeaders || {}),
    },
    ...restOptions,
  });

  if (!response.ok) {
    const errorMessage = await readErrorMessage(response);
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};