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
  const response = await axios.get(`${API_URL}/applications/volunteer/mine`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Hämta volontärens tillgänglighet
export const getMyAvailability = async () => {
  const response = await axios.get(`${API_URL}/me/availability`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Uppdatera tillgänglighet
export const updateMyAvailability = async (dates) => {
  const response = await axios.put(
    `${API_URL}/me/availability`,
    { dates },
    { headers: authHeaders() },
  );
  return response.data;
};

/* ==========================================================================
   LIKES
   ========================================================================== */

// Toggla like
export const toggleJobLike = async (jobId) => {
  const response = await axios.post(`${API_URL}/jobs/${jobId}/like`, null, {
    headers: authHeaders(),
  });
  return response.data;
};

// Hämta antal likes + om jag har likat
export const getJobLikes = async (jobId) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}/likes`, {
    headers: authHeaders(),
  });
  return response.data;
};

/* ==========================================================================
   COMMENTS
   ========================================================================== */

// Hämta alla kommentarer för ett jobb
export const getJobComments = async (jobId) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}/comments`);
  return response.data;
};

// Lägg till kommentar
export const addJobComment = async (jobId, content, parentCommentId = null) => {
  const response = await axios.post(
    `${API_URL}/jobs/${jobId}/comments`,
    { content, parentCommentId },
    { headers: authHeaders() },
  );
  return response.data;
};

// Ta bort egen kommentar
export const deleteJobComment = async (jobId, commentId) => {
  const response = await axios.delete(
    `${API_URL}/jobs/${jobId}/comments/${commentId}`,
    { headers: authHeaders() },
  );
  return response.data;
};

// Toggla like på en kommentar
export const toggleCommentLike = async (commentId) => {
  const response = await axios.post(
    `${API_URL}/comments/${commentId}/like`,
    null,
    { headers: authHeaders() },
  );
  return response.data;
};

// Hämta alla ansökningar för ett specifikt jobb (org)
export const getJobApplications = async (jobId) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}/applications`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Godkänn flera ansökningar samtidigt
export const bulkApproveApplications = async (applicationIds) => {
  const response = await axios.post(
    `${API_URL}/applications/bulk-approve`,
    { applicationIds },
    { headers: authHeaders() },
  );
  return response.data;
};

// Hämta full profil för en volontär
export const getVolunteerProfile = async (volunteerId) => {
  const response = await axios.get(`${API_URL}/volunteers/${volunteerId}`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Hämta ett specifikt jobb
export const getJobById = async (jobId) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Uppdatera ett jobb
export const updateJob = async (jobId, jobData) => {
  const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData, {
    headers: authHeaders(),
  });
  return response.data;
};
