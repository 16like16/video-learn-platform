import { session } from './auth';

const API_BASE = 'http://localhost:3000/api';
const FILE_BASE = 'http://localhost:3000';

const buildHeaders = (isFormData) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }
  return headers;
};

export const apiRequest = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: buildHeaders(isFormData),
    body: isFormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
  });

  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.message || '请求失败');
  }

  return payload.data;
};

export const toFileUrl = (path) => {
  if (!path) {
    return '';
  }
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return `${FILE_BASE}${path}`;
};
