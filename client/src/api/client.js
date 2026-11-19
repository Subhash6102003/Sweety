export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${path}`;
};

const getAuthHeader = () => {
  const token = localStorage.getItem('sweety_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  get: async (url) => {
    const res = await fetch(getApiUrl(url), {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(res);
  },

  post: async (url, body) => {
    const res = await fetch(getApiUrl(url), {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  put: async (url, body) => {
    const res = await fetch(getApiUrl(url), {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  delete: async (url) => {
    const res = await fetch(getApiUrl(url), {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(res);
  }
};
