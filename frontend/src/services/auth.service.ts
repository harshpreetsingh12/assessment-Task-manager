import Cookies from 'js-cookie';
import { apiClient } from './apiClient';

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterCredentials = {
  email: string;
  password: string;
  name?: string; 
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const res = await apiClient('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (res.data?.token) {
      Cookies.set('token', res.data.token, { expires: 7, secure: true, sameSite: 'strict' });
      localStorage.setItem('hasSession', 'true');
    }
    return res;
  },

  register: async (userData: RegisterCredentials) => {
    const res = await apiClient('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
    if (res.data?.token) {
      Cookies.set('token', res.data.token, { expires: 7, secure: true, sameSite: 'strict' });
      localStorage.setItem('hasSession', 'true');
    }
    return res;
  },

  logout: async () => {
    Cookies.remove('token');
    localStorage.removeItem('hasSession');
    return apiClient('/auth/logout', { method: 'POST' });
  },
};