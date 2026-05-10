import axios from "axios";
import { getSession } from "./authService";

const API_URL = "https://localhost:7007";

export const createJob = async (jobData) => {
  const session = getSession();
  const token = session?.accessToken;

  const response = await axios.post(`${API_URL}/jobs`, jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
