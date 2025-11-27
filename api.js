// api.js - API Helper Functions for Frontend

const API_URL = 'https://heartspace-backend.vercel.app';

// ========== HELPER FUNCTIONS ==========

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// ========== AUTH FUNCTIONS ==========

async function signup(email, password, name) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password, name })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, data };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error. Is the backend running?' };
  }
}

async function signin(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, data };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error. Is the backend running?' };
  }
}

function signout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Don't redirect here - let the calling function handle it
  return true;
}

function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
  return !!getToken();
}

// ========== ARTWORK FUNCTIONS ==========

async function uploadArtwork(formData) {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/artworks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to upload artwork' };
  }
}

async function getArtworks() {
  try {
    const response = await fetch(`${API_URL}/artworks`);
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to fetch artworks' };
  }
}

async function getArtwork(id) {
  try {
    const response = await fetch(`${API_URL}/artworks/${id}`);
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to fetch artwork' };
  }
}

async function likeArtwork(id) {
  try {
    const response = await fetch(`${API_URL}/artworks/${id}/like`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to like artwork' };
  }
}

async function commentOnArtwork(id, content) {
  try {
    const response = await fetch(`${API_URL}/artworks/${id}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to add comment' };
  }
}

// ========== COMMUNITY POST FUNCTIONS ==========

async function createPost(content) {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to create post' };
  }
}

async function getPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to fetch posts' };
  }
}

// ========== LEARNING MODULE FUNCTIONS ==========

async function getModules() {
  try {
    const response = await fetch(`${API_URL}/modules`);
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to fetch modules' };
  }
}

async function getProgress() {
  try {
    const response = await fetch(`${API_URL}/progress`, {
      headers: getHeaders()
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to fetch progress' };
  }
}

async function updateProgress(moduleId, completed) {
  try {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ moduleId, completed })
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to update progress' };
  }
}

// ========== SESSION FUNCTIONS ==========

async function createSessionAPI(title, date, time, maxAttendees) {
  try {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, date, time, maxAttendees })
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to create session' };
  }
}

async function getSessions() {
  try {
    const response = await fetch(`${API_URL}/sessions`);
    const data = await response.json();
    
    console.log("getSessions raw response:", { ok: response.ok, status: response.status, data });
    
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    console.error("getSessions network error:", error);
    return { success: false, error: 'Failed to fetch sessions' };
  }
}

async function joinSessionAPI(sessionId) {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/join`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to join session' };
  }
}

async function leaveSessionAPI(sessionId) {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}/leave`, {
      method: 'POST',
      headers: getHeaders()
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to leave session' };
  }
}

async function deleteSessionAPI(sessionId) {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, error: data.error };
  } catch (error) {
    return { success: false, error: 'Failed to delete session' };
  }
}