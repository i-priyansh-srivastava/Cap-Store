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
        console.log('User logged in with premium status:', response.data.user.isPremium);
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
        console.log('User signed up with premium status:', response.data.user.isPremium);
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

  static updateUserData(newUserData) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        user: {
          ...currentUser.user,
          ...newUserData
        }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  }

  static refreshUserData() {
    const user = this.getCurrentUser();
    if (user && user.user && user.user.id) {
      // You could make an API call here to get fresh user data
      // For now, we'll just return the current data
      return user;
    }
    return null;
  }
}

export default AuthService; 