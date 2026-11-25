import axios from 'axios';
import api from './api';

// ---------------- PUBLIC ENDPOINTS ----------------

export const fetchPublicProjects = async (params = {}) => {
  const { data } = await api.get('/projects/public', { params });
  return data.data.projects;
};

export const fetchPublicCategories = async () => {
  const { data } = await api.get('/categories/public');
  return data.data.categories;
};

export const fetchPublicServices = async () => {
  const { data } = await api.get('/services/public');
  return data.data.services;
};

export const fetchProfile = async () => {
  const { data } = await api.get('/profile');
  return data.data.profile;
};

export const fetchSettings = async () => {
  const { data } = await api.get('/settings');
  return data.data.settings;
};

export const submitPublicEnquiry = async (payload) => {
  const { data } = await api.post('/enquiries', payload);
  return data;
};

// ---------------- ADMIN DASHBOARD ----------------

export const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard/stats');
  return data.data;
};

// ---------------- ADMIN PROJECTS ----------------

export const fetchAdminProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params });
  return data.data;
};

export const fetchAdminProjectById = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data.data.project;
};

export const createProject = async (payload) => {
  const { data } = await api.post('/projects', payload);
  return data.data.project;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data.data.project;
};

export const toggleProjectFeatured = async (id) => {
  const { data } = await api.patch(`/projects/${id}/toggle-featured`);
  return data.data.project;
};

export const toggleProjectStatus = async (id) => {
  const { data } = await api.patch(`/projects/${id}/toggle-status`);
  return data.data.project;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

// ---------------- ADMIN CATEGORIES ----------------

export const fetchAdminCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data.categories;
};

export const createCategory = async (payload) => {
  const { data } = await api.post('/categories', payload);
  return data.data.category;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.data.category;
};

export const deleteCategory = async (id, reassignTo = '') => {
  const params = reassignTo ? { reassignTo } : undefined;
  const { data } = await api.delete(`/categories/${id}`, { params });
  return data;
};

// ---------------- ADMIN SERVICES ----------------

export const fetchAdminServices = async () => {
  const { data } = await api.get('/services');
  return data.data.services;
};

export const createService = async (payload) => {
  const { data } = await api.post('/services', payload);
  return data.data.service;
};

export const updateService = async (id, payload) => {
  const { data } = await api.put(`/services/${id}`, payload);
  return data.data.service;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}`);
  return data;
};

// ---------------- ADMIN PROFILE & SETTINGS ----------------

export const updateProfile = async (payload) => {
  const { data } = await api.put('/profile', payload);
  return data.data.profile;
};

export const updateSettings = async (payload) => {
  const { data } = await api.put('/settings', payload);
  return data.data.settings;
};

// ---------------- ADMIN ENQUIRIES ----------------

export const fetchAdminEnquiries = async (params = {}) => {
  const { data } = await api.get('/enquiries', { params });
  return data.data;
};

export const toggleEnquiryRead = async (id, isRead) => {
  const payload = typeof isRead === 'boolean' ? { isRead } : {};
  const { data } = await api.patch(`/enquiries/${id}/read`, payload);
  return data.data.enquiry;
};

export const deleteEnquiry = async (id) => {
  const { data } = await api.delete(`/enquiries/${id}`);
  return data;
};

// ---------------- SIGNED CLOUDINARY UPLOADS ----------------

export const uploadMediaToCloudinary = async ({
  file,
  resourceType,
  folder,
  onProgress,
}) => {
  const { data: signRes } = await api.post('/uploads/sign', {
    resourceType,
    fileType: file.type,
    fileSize: file.size,
    folder,
  });

  const { signature, timestamp, cloudName, apiKey, folder: signedFolder } =
    signRes.data;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', signedFolder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const response = await axios.post(uploadUrl, formData, {
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return {
    secureUrl: response.data.secure_url,
    publicId: response.data.public_id,
    duration: response.data.duration || null,
  };
};
