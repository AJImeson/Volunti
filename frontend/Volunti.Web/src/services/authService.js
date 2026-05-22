import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const STORAGE_KEY = "volunti_session";

/* ==========================================================================
   AXIOS INSTANS
   ========================================================================== */

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }
    return Promise.reject(error);
  },
);

/* ==========================================================================
   FELHANTERING
   ========================================================================== */

const extractErrorMessage = (error, fallback) => {
  if (error.response?.data) {
    const data = error.response.data;
    if (Array.isArray(data)) return data.join(" ");
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.title) return data.title;
  }
  return fallback;
};

/* ==========================================================================
   TELEFONNUMMER NORMALISERING
   ========================================================================== */

export const normalizePhoneNumber = (input) => {
  if (!input) return "";

  let cleaned = input.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+46")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("46") && cleaned.length === 11) {
    cleaned = "0" + cleaned.slice(2);
  } else if (!cleaned.startsWith("0") && cleaned.length === 9) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
};

/* ==========================================================================
   AUTH
   ========================================================================== */

export const registerVolunteer = async (formData) => {
  const normalizedPhone = normalizePhoneNumber(formData.phone);

  const payload = {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phoneNumber: normalizedPhone,
    municipality: formData.kommun,
    driverLicense: formData.korkort.join(","),
    availability: formData.availability.join(","),
    maxDistanceKm: formData.distanceAny ? 0 : Number(formData.distance),
    notificationPreference: formData.notificationLevel,
    emailNotifications: formData.emailNotification === "Ja",
    interests: formData.categories,
  };

  try {
    const { data } = await api.post("/register/volunteer", payload);

    const profile = {
      email: data.email,
      userName: data.userName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: normalizedPhone,
      municipality: formData.kommun,
      driverLicense: formData.korkort,
      availability: formData.availability,
      interests: formData.categories,
      maxDistanceKm: formData.distanceAny ? null : Number(formData.distance),
      notificationPreference: formData.notificationLevel,
      emailNotifications: formData.emailNotification === "Ja",
    };

    saveSession({ token: data.token, profile });
    return profile;
  } catch (error) {
    throw new Error(
      extractErrorMessage(error, "Registreringen misslyckades. Försök igen."),
    );
  }
};

export const registerOrganization = async (formData) => {
  const payload = {
    email: formData.email,
    password: formData.password,

    companyName: formData.foretagsnamn,
    orgName: formData.organisationsnamn,
    contactName: formData.namn,

    municipality: formData.kommun,
    description: formData.beskrivning,

    categories: formData.branscher,

    requiresDocumentation: formData.dokumentation === "Ja",

    notificationPreference: formData.notificationLevel,

    emailNotifications: formData.emailNotification === "Ja",
  };

  try {
    const { data } = await api.post("/register/organization", payload);

    const profile = {
      email: data.email,
      userName: data.userName,
      companyName: formData.foretagsnamn,
      orgName: formData.organisationsnamn,
    };

    saveSession({
      token: data.token,
      profile,
    });

    return profile;
  } catch (error) {
    if (!error.response) {
      throw new Error("Kunde inte ansluta till servern.");
    }
    throw new Error(extractErrorMessage(error, "Registreringen misslyckades."));
  }
};

export const checkAvailability = async (email, phoneNumber) => {
  try {
    const { data } = await api.post("/register/check-availability", {
      email,
      phoneNumber: normalizePhoneNumber(phoneNumber),
    });
    return data;
  } catch {
    return { emailTaken: false, phoneTaken: false };
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await api.post("/login", {
      username: email,
      password,
    });

    const existing = getSession();
    const profile = existing?.profile
      ? { ...existing.profile, email: data.email, userName: data.userName }
      : { email: data.email, userName: data.userName };

    saveSession({ token: data.token, profile });
    return profile;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Fel mejl eller lösenord.");
    }
    throw new Error(
      extractErrorMessage(error, "Inloggningen misslyckades. Försök igen."),
    );
  }
};

/* ==========================================================================
   PROFIL
   ========================================================================== */

export const fetchCurrentUserProfile = async () => {
  try {
    const { data } = await api.get("/me");

    const profile = {
      ...data,
      driverLicense: data.driverLicense ? data.driverLicense.split(",") : [],
      availability: data.availability ? data.availability.split(",") : [],
      interests: [],
    };

    const token = getToken();
    if (token) saveSession({ token, profile });
    return profile;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Sessionen har gått ut. Logga in igen.");
    }
    throw new Error(extractErrorMessage(error, "Kunde inte hämta profildata."));
  }
};

export const fetchCurrentOrganization = async () => {
  try {
    const { data } = await api.get("/me/organization");
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Sessionen har gått ut. Logga in igen.");
    }
    throw new Error(
      extractErrorMessage(error, "Kunde inte hämta organisationsdata."),
    );
  }
};
/* ==========================================================================
   PROFILBILD
   ========================================================================== */

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/me/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const removeProfileImage = async () => {
  await api.delete("/me/profile-image");
};

export const getProfileImageUrl = (relativeUrl) => {
  if (!relativeUrl) return null;
  if (relativeUrl.startsWith("http")) return relativeUrl;
  return `${API_BASE}${relativeUrl}`;
};

/* ==========================================================================
   SKILLS
   ========================================================================== */

export const fetchSkills = async () => {
  const { data } = await api.get("/me/skills");
  return data;
};

export const addSkill = async (title) => {
  const { data } = await api.post("/me/skills", { title });
  return data;
};

export const removeSkill = async (id) => {
  await api.delete(`/me/skills/${id}`);
};

/* ==========================================================================
   INTERESTS
   ========================================================================== */

export const fetchInterests = async () => {
  const { data } = await api.get("/me/interests");
  return data;
};

export const addInterest = async (title) => {
  const { data } = await api.post("/me/interests", { title });
  return data;
};

export const removeInterest = async (id) => {
  await api.delete(`/me/interests/${id}`);
};

/* ==========================================================================
   FILER
   ========================================================================== */

export const uploadFile = async ({
  file,
  category,
  title = "",
  experienceId = null,
}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  formData.append("title", title);
  if (experienceId !== null) formData.append("experienceId", experienceId);

  const { data } = await api.post("/me/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchFiles = async (category = null) => {
  const url = category
    ? `/me/files?category=${encodeURIComponent(category)}`
    : "/me/files";
  const { data } = await api.get(url);
  return data;
};

export const deleteFile = async (fileId) => {
  await api.delete(`/me/files/${fileId}`);
};

export const downloadFile = async (fileId, fallbackName = "fil") => {
  const response = await api.get(`/me/files/${fileId}/download`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;

  const disposition = response.headers["content-disposition"];
  let filename = fallbackName;
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match) filename = match[1];
  }

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/* ==========================================================================
   EXPERIENCES
   ========================================================================== */

export const fetchExperiences = async () => {
  const { data } = await api.get("/me/experiences");
  return data;
};

export const addExperience = async (experience) => {
  const { data } = await api.post("/me/experiences", experience);
  return data;
};

export const removeExperience = async (id) => {
  await api.delete(`/me/experiences/${id}`);
};

export const fetchMyApplications = async () => {
  const { data } = await api.get("/applications/volunteer/mine");
  return data;
};

/* ==========================================================================
   SESSION
   ========================================================================== */

export const saveSession = (session) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const getSession = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const getCurrentUser = () => {
  const session = getSession();
  return session?.profile || null;
};

export const getToken = () => {
  const session = getSession();
  return session?.token || null;
};

export const isLoggedIn = () => !!getToken();

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const authFetch = api;

export default api;

/*Skick join till org user som OrgAdmin */
export const inviteOrgMember = async (email, password) => {
  const { data } = await api.post("/org/members", { email, password });
  return data;
};
