const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // File upload
  async upload(endpoint, formData) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData
    });
  }

  // Auth specific methods
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('token');
  }

  // Projects
  async getProjects() {
    return this.get('/projects');
  }

  async getProject(id) {
    return this.get(`/projects/${id}`);
  }

  async createProject(data) {
    return this.post('/projects', data);
  }

  async updateProject(id, data) {
    return this.put(`/projects/${id}`, data);
  }

  async deleteProject(id) {
    return this.delete(`/projects/${id}`);
  }

  // Blog
  async getBlogs() {
    return this.get('/blog');
  }

  async getBlog(id) {
    return this.get(`/blog/${id}`);
  }

  async createBlog(data) {
    return this.post('/blog', data);
  }

  async updateBlog(id, data) {
    return this.put(`/blog/${id}`, data);
  }

  async deleteBlog(id) {
    return this.delete(`/blog/${id}`);
  }

  // Skills
  async getSkills() {
    return this.get('/skills');
  }

  async createSkill(data) {
    return this.post('/skills', data);
  }

  async updateSkill(id, data) {
    return this.put(`/skills/${id}`, data);
  }

  async deleteSkill(id) {
    return this.delete(`/skills/${id}`);
  }

  // Contact
  async submitContact(data) {
    return this.post('/contact', data);
  }

  async getContacts() {
    return this.get('/contact');
  }

  // Analytics
  async getAnalytics() {
    return this.get('/analytics');
  }
}

export default new ApiService();