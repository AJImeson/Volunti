import axios from "axios";
import { getSession } from "./authService";

const API_URL = import.meta.env.VITE_API_BASE;

// Hjälpfunktion: bygg auth-header från session (DRY - undvik upprepning i varje request)
const authHeaders = () => {
  const session = getSession();
  return {
    Authorization: `Bearer ${session?.token}`,
  };
};

// Skapa nytt jobb (OrgAdmin + OrgUser) - används av CreateJobForm
export const createJob = async (jobData) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData, {
    headers: authHeaders(),
  });
  return response.data;
};

// Hämta jobb som tillhör inloggad användares organisation - används av OrgAdmin Dashboard
export const getMyJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs/mine`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Hämta volontäransökningar för inloggad orgs jobb, valfri statusfilter (Pending/Approved/Rejected)
export const getMyApplications = async (status = null) => {
  const url = status
    ? `${API_URL}/applications/mine?status=${status}`
    : `${API_URL}/applications/mine`;

  const response = await axios.get(url, {
    headers: authHeaders(),
  });
  return response.data;
};

// Godkänn eller avvisa en ansökan
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await axios.put(
    `${API_URL}/applications/${applicationId}`,
    { status },
    { headers: authHeaders() },
  );
  return response.data;
};

// Hämta alla öppna jobb
export const fetchAllJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`);
  return response.data;
};

// Volontär ansöker till ett jobb
export const applyToJob = async (jobId) => {
  const response = await axios.post(`${API_URL}/jobs/${jobId}/apply`, null, {
    headers: authHeaders(),
  });
  return response.data;
};

// Volontär hämtar sina egna ansökningar
export const getMyApplicationsAsVolunteer = async () => {
  const response = await axios.get(`${API_URL}/me/applications`, {
    headers: authHeaders(),
  });
  return response.data;
};
