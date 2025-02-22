import { createStore } from 'vuex'; 
import axios from 'axios'; // Import axios for making API calls if needed

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const store = createStore({
  state: {
    token: localStorage.getItem('token') || null, // Initialize token to null if not found in localStorage
  },

  mutations: {
    // Update token
    UPDATE_TOKEN(state, payload) { 
      state.token = payload;
    }
  },

  actions: {
    // Set token in localStorage and Vuex state
    setToken({ commit }, payload) {
      localStorage.setItem('token', payload);
      commit('UPDATE_TOKEN', payload);
    },

    removeToken({ commit }) {
      localStorage.removeItem('token');
      commit('UPDATE_TOKEN', null);
    },

    async logout({ dispatch }) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post(`${API_BASE_URL}/api/v1/logout`, {}, { 
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (error) {
        console.log("Logout failed:", error);
      } finally {
        dispatch('removeToken'); // Clear token
      }
    }
  },

  getters: {
    // Get token from state
    getToken(state) {
      return state.token;
    }
  }
});

export default store;
