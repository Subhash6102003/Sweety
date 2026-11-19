import { CONFIG } from '../config.mjs';

export class ApiClient {
  constructor(baseUrl = CONFIG.API_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = null;
    this.user = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
    this.user = null;
  }

  async request(method, path, body = null, customHeaders = {}) {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    
    const headers = {
      'Accept': 'application/json',
      ...customHeaders
    };

    if (body !== null && typeof body === 'object' && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options = {
      method: method.toUpperCase(),
      headers,
      signal: AbortSignal.timeout(CONFIG.TIMEOUT_MS)
    };

    if (body !== null) {
      options.body = typeof body === 'object' ? JSON.stringify(body) : body;
    }

    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type') || '';
      let data;

      if (contentType.includes('application/json')) {
        data = await res.json().catch(() => null);
      } else {
        data = await res.text().catch(() => '');
      }

      return {
        status: res.status,
        ok: res.ok,
        headers: res.headers,
        body: data
      };
    } catch (err) {
      return {
        status: 0,
        ok: false,
        error: err.message,
        body: null
      };
    }
  }

  async get(path, customHeaders = {}) {
    return this.request('GET', path, null, customHeaders);
  }

  async post(path, body = {}, customHeaders = {}) {
    return this.request('POST', path, body, customHeaders);
  }

  async put(path, body = {}, customHeaders = {}) {
    return this.request('PUT', path, body, customHeaders);
  }

  async delete(path, customHeaders = {}) {
    return this.request('DELETE', path, null, customHeaders);
  }

  async healthCheck() {
    const res = await this.get('/api/health');
    return res.status === 200 && res.body?.status === 'ok';
  }

  async login(email = CONFIG.DEMO_USER.email, password = CONFIG.DEMO_USER.password) {
    const res = await this.post('/api/auth/login', { email, password });
    if (res.ok && res.body?.token) {
      this.token = res.body.token;
      this.user = res.body.user;
    }
    return res;
  }

  async register(name, email, password) {
    const res = await this.post('/api/auth/register', { name, email, password });
    if (res.ok && res.body?.token) {
      this.token = res.body.token;
      this.user = res.body.user;
    }
    return res;
  }
}
