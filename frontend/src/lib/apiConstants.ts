// API Base URL
export const API_BASE_URL = 'http://localhost:5001/api';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,
  UPDATE_DETAILS: `${API_BASE_URL}/auth/updatedetails`,
  UPDATE_PASSWORD: `${API_BASE_URL}/auth/updatepassword`,
};

// Book Endpoints
export const BOOK_ENDPOINTS = {
  ALL_BOOKS: `${API_BASE_URL}/books`,
  BOOK_BY_ID: (id: string) => `${API_BASE_URL}/books/${id}`,
  BOOKS_BY_STATUS: (status: string) => `${API_BASE_URL}/books/status/${status}`,
  STATS: `${API_BASE_URL}/books/stats`,
};

// Headers
export const getAuthHeaders = (token?: string) => {
  const storedToken = token || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {})
  };
};

// Generic fetch function with error handling
export async function fetchAPI(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error: any) {
    console.error('API request error:', error.message);
    throw error;
  }
}