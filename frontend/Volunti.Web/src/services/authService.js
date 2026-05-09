import axios from 'axios';

// TODO: PRODUKTION - Byt ut hårdkodad URL mot miljövariabel innan deploy
// HUR: 1) Skapa .env.development och .env.production i projektets rot
//      2) Lägg in VITE_API_URL=https://localhost:7007 (dev) respektive riktig backend-URL (prod)
//      3) Ändra raden nedan till: const API_URL = import.meta.env.VITE_API_URL;
//      4) Lägg till .env.local och .env.*.local i .gitignore



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