/**
 * Centralized authentication utilities for API calls
 */

/**
 * Get authentication headers for API requests
 * This function handles token extraction from cookies and localStorage
 */
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    // First try to get token from localStorage
    if (typeof window !== 'undefined') {
      const lsToken = localStorage.getItem('better-auth.session_token');
      if (lsToken) {
        headers['Authorization'] = `Bearer ${lsToken}`;
        return headers;
      }
    }

    // Fallback to cookie parsing
    if (typeof document !== 'undefined') {
      const allCookies = document.cookie;
      const token = allCookies
        .split('; ')
        .find(row => row.startsWith('better-auth.session_token='))
        ?.split('=')[1];

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Failed to get auth headers:', error);
  }

  return headers;
};

/**
 * Make an authenticated API request
 * Automatically includes auth headers and credentials
 */
export const authenticatedFetch = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const headers = await getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    credentials: 'include',
  });
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (response: Response, context: string = 'API call') => {
  if (response.status === 401) {
    throw new Error('Unauthorized - please log in again');
  }
  if (response.status === 403) {
    throw new Error('Forbidden - insufficient permissions');
  }
  if (!response.ok) {
    throw new Error(`${context} failed with status ${response.status}`);
  }
};
