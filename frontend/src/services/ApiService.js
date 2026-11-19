// AI Learning Insight - API Service
// Base URL untuk FastAPI backend (mendukung environment variable untuk deployment)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// === HELPER FUNCTIONS ===

/**
 * Get JWT token from localStorage
 */
const getToken = () => localStorage.getItem('access_token');

/**
 * Core API request handler
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    // Handle non-OK responses
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error(`Server Error (${response.status})`);
        }
        throw new Error(errorData.detail || errorData.message || 'Terjadi kesalahan pada server.');
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// === AUTHENTICATION API ===

/**
 * Register new user
 * @param {Object} userData - { username, email, password, display_name }
 */
export const register = async (userData) => {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    // Store token and user data
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
};

/**
 * Login user
 * @param {string} username
 * @param {string} password
 */
export const login = async (username, password) => {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });

    // Store token and user data
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
};

/**
 * Logout current user
 */
export const logout = async () => {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
        // Always clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
    return apiRequest('/auth/me', { method: 'GET' });
};

// === LEARNING TELEMETRY API ===

/**
 * Get user learning telemetry including learning style prediction
 */
export const getTelemetry = async () => {
    return apiRequest('/api/learning/telemetry', { method: 'GET' });
};

// === AI INSIGHTS API ===

/**
 * Get AI-generated insight for current user
 */
export const getInsight = async () => {
    return apiRequest('/api/learning/insight', { method: 'GET' });
};

/**
 * Get insight history with pagination
 * @param {number} limit - Number of insights per page (1-100)
 * @param {number} offset - Offset for pagination
 */
export const getInsightHistory = async (limit = 10, offset = 0) => {
    return apiRequest(`/api/learning/insight/history?limit=${limit}&offset=${offset}`, {
        method: 'GET'
    });
};

// === COURSE RECOMMENDATIONS API ===

/**
 * Get course recommendations based on Market Basket Analysis
 * @param {number} n - Number of recommendations (1-20)
 */
export const getRecommendations = async (n = 5) => {
    return apiRequest(`/api/learning/recommendation?n=${n}`, { method: 'GET' });
};

// === ACTIVITY LOGGING API ===

/**
 * Log a learning activity
 * @param {Object} activityData - { journey_id, tutorial_id, action, duration_seconds }
 * action types: 'view', 'complete', 'submit'
 */
export const logActivity = async (activityData) => {
    return apiRequest('/api/learning/activity', {
        method: 'POST',
        body: JSON.stringify(activityData),
    });
};

/**
 * Get activity history
 * @param {number} limit - Number of activities (1-200)
 */
export const getActivityHistory = async (limit = 50) => {
    return apiRequest(`/api/learning/activity?limit=${limit}`, { method: 'GET' });
};

// === PROFILE API (Placeholder - Backend may not support this) ===

/**
 * Update user profile (name and avatar)
 * Note: This endpoint may not be implemented in the backend yet
 * For now, it just updates localStorage
 */
export const updateUserProfile = async (userId, name, file) => {
    // If backend supports profile update, uncomment below:
    /*
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('name', name);
    if (file) {
        formData.append('avatar', file);
    }
    
    const response = await fetch(`${BASE_URL}/api/profile/update`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Gagal update profil');
    }
    return response.json();
    */

    // For now, just return a mock success response
    // The actual update happens in localStorage on the frontend
    return {
        data: {
            name: name,
            image_path: file ? URL.createObjectURL(file) : null
        }
    };
};

// === UTILITY EXPORTS ===

export const isAuthenticated = () => {
    return !!getToken();
};

export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};