import axios from 'axios';

const API_URL = 'https://localhost:7007';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username: email,
    password: password
  });
  saveSession(response.data);
  return response.data;
};

export const saveSession = (user) => {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
};

export const getSession = () => {
  const stored = sessionStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
};

export const clearSession = () => {
  sessionStorage.removeItem("currentUser");
};