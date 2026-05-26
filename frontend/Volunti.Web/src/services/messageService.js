import axios from "axios";
import { getSession } from "./authService";

const API_URL = import.meta.env.VITE_API_BASE;

const authHeaders = () => {
  const session = getSession();
  return {
    Authorization: `Bearer ${session?.token}`,
  };
};

/* ==========================================================================
   GROUPS
   ========================================================================== */

// Lista alla grupper jag är med i
export const getMyGroups = async () => {
  const response = await axios.get(`${API_URL}/groups`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Hämta detaljer för en specifik grupp
export const getGroupDetails = async (groupId) => {
  const response = await axios.get(`${API_URL}/groups/${groupId}`, {
    headers: authHeaders(),
  });
  return response.data;
};

// Skapa en ny grupp
export const createGroup = async (name, description) => {
  const response = await axios.post(
    `${API_URL}/groups`,
    { name, description },
    { headers: authHeaders() },
  );
  return response.data;
};

// Ta bort grupp
export const deleteGroup = async (groupId) => {
  await axios.delete(`${API_URL}/groups/${groupId}`, {
    headers: authHeaders(),
  });
};

/* ==========================================================================
   MEMBERS
   ========================================================================== */

// Lägg till medlem
export const addGroupMember = async (groupId, userId) => {
  await axios.post(
    `${API_URL}/groups/${groupId}/members`,
    { userId },
    { headers: authHeaders() },
  );
};

// Sök användare för att lägga till i grupp
export const searchUsersForGroup = async (groupId, query) => {
  const response = await axios.get(
    `${API_URL}/groups/${groupId}/search-users`,
    {
      params: { q: query },
      headers: authHeaders(),
    },
  );
  return response.data;
};

// Ta bort medlem
export const removeGroupMember = async (groupId, userId) => {
  await axios.delete(`${API_URL}/groups/${groupId}/members/${userId}`, {
    headers: authHeaders(),
  });
};

/* ==========================================================================
   MESSAGES
   ========================================================================== */

// Hämta meddelanden
export const getGroupMessages = async (groupId, before = null, limit = 50) => {
  const params = new URLSearchParams();
  if (before) params.append("before", before);
  if (limit) params.append("limit", limit);

  const response = await axios.get(
    `${API_URL}/groups/${groupId}/messages?${params}`,
    { headers: authHeaders() },
  );
  return response.data;
};

// Skicka meddelande
export const sendGroupMessage = async (groupId, content, files = []) => {
  const session = getSession();
  const token = session?.token;

  if (files.length > 0) {
    // Skicka som multipart om det finns filer
    const formData = new FormData();
    if (content) formData.append("content", content);
    files.forEach((f) => formData.append("files", f));

    const response = await axios.post(
      `${API_URL}/groups/${groupId}/messages`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } else {
    // Bara text
    const response = await axios.post(
      `${API_URL}/groups/${groupId}/messages`,
      { content },
      { headers: authHeaders() },
    );
    return response.data;
  }
};

// Ta bort eget meddelande
export const deleteGroupMessage = async (groupId, messageId) => {
  await axios.delete(`${API_URL}/groups/${groupId}/messages/${messageId}`, {
    headers: authHeaders(),
  });
};

/* ==========================================================================
   READ STATUS
   ========================================================================== */

// Markera grupp som läst
export const markGroupAsRead = async (groupId) => {
  await axios.post(`${API_URL}/groups/${groupId}/read`, null, {
    headers: authHeaders(),
  });
};

// Hämta total unread count
export const getUnreadCount = async () => {
  const response = await axios.get(`${API_URL}/groups/unread-count`, {
    headers: authHeaders(),
  });
  return response.data; // count
};

/* ==========================================================================
   ATTACHMENTS
   ========================================================================== */

// Hjälpare för att bygga URL till bilder
export const getAttachmentUrl = (groupId, attachmentId) => {
  return `${API_URL}/groups/${groupId}/attachments/${attachmentId}`;
};
