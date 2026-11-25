import api from './api';

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data.data.admin;
};

export const logoutAdmin = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const fetchCurrentAdmin = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.admin;
};
