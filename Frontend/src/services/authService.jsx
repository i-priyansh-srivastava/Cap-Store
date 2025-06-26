import axios from 'axios';
const API_URL = 'http://localhost:5000/api/v1';

class AuthService {
  static async login(email , password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  static async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, userData);

      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  }

  static logout() {
    localStorage.removeItem('user');
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static getToken() {
    const user = this.getCurrentUser();
    return user?.token;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default AuthService; 