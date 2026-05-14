import axios from "axios";
import { getSession } from "./authService";

const API_URL = import.meta.env.VITE_API_BASE;

export const createJob = async (jobData) => {
  const session = getSession();
  const token = session?.token;

  const response = await axios.post(`${API_URL}/jobs`, jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
