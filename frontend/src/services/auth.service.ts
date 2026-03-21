import Cookies from 'js-cookie';
import { apiClient } from './apiClient';

export const authService = {
  login: async (credentials: any) => {
    const res = await apiClient('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (res.data?.token) {
      Cookies.set('token', res.data.token, { expires: 7, secure: true, sameSite: 'strict' });
    }
    return res;
  },

  register: async (userData: any) => {
    const res = await apiClient('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
    if (res.data?.token) {
      Cookies.set('token', res.data.token, { expires: 7, secure: true, sameSite: 'strict' });
    }
    return res;
  },

  logout: async () => {
    Cookies.remove('token');
    return apiClient('/auth/logout', { method: 'POST' });
  },
};