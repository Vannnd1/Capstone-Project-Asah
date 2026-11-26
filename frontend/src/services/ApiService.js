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
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userId', String(data.user.id || ''));
            localStorage.setItem('userName', data.user.display_name || data.user.username || '');
            localStorage.setItem('userEmail', data.user.email || '');
            localStorage.setItem('userAvatarPath', data.user.image_path || '');
        }
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
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userId', String(data.user.id || ''));
            localStorage.setItem('userName', data.user.display_name || data.user.username || '');
            localStorage.setItem('userEmail', data.user.email || '');
            localStorage.setItem('userAvatarPath', data.user.image_path || '');
        }
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
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatarPath');
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

/**
 * Get user skill map and AI evaluation cards derived from real activities
 * @param {string} lang - 'id' | 'en'
 */
export const getSkillMap = async (lang = 'id') => {
    return apiRequest(`/api/learning/skill-map?lang=${lang}`, { method: 'GET' });
};

// === AI INSIGHTS API ===

/**
 * Get AI-generated insight for current user
 * @param {string} lang - 'id' | 'en'
 */
export const getInsight = async (lang = 'id') => {
    return apiRequest(`/api/learning/insight?lang=${lang}`, { method: 'GET' });
};

/**
 * Get insight history with pagination
 * @param {number} limit - Number of insights per page (1-100)
 * @param {number} offset - Offset for pagination
 * @param {string} lang - 'id' | 'en'
 */
export const getInsightHistory = async (limit = 10, offset = 0, lang = 'id') => {
    return apiRequest(`/api/learning/insight/history?limit=${limit}&offset=${offset}&lang=${lang}`, {
        method: 'GET'
    });
};

// === COURSE RECOMMENDATIONS API ===

/**
 * Get course recommendations based on user activities and skill gaps
 * @param {number} n - Number of recommendations (1-20)
 * @param {string} lang - 'id' | 'en'
 */
export const getRecommendations = async (n = 5, lang = 'id') => {
    return apiRequest(`/api/learning/recommendation?n=${n}&lang=${lang}`, { method: 'GET' });
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
 * Remove a logged learning activity (e.g. when un-completing a module)
 * @param {number} journeyId
 * @param {number} tutorialId
 * @param {string} action
 */
export const removeActivity = async (journeyId, tutorialId, action = 'complete') => {
    return apiRequest(
        `/api/learning/activity?journey_id=${journeyId}&tutorial_id=${tutorialId}&action=${encodeURIComponent(action)}`,
        { method: 'DELETE' }
    );
};

/**
 * Get activity history
 * @param {number} limit - Number of activities (1-200)
 */
export const getActivityHistory = async (limit = 50) => {
    return apiRequest(`/api/learning/activity?limit=${limit}`, { method: 'GET' });
};

// === LEARNING TARGET API ===

/**
 * Update user learning target
 * @param {string} target - 'santai' | 'fokus' | 'hardcore'
 */
export const updateLearningTarget = async (target) => {
    try {
        const data = await apiRequest('/api/learning/target', {
            method: 'PUT',
            body: JSON.stringify({ learning_target: target }),
        });
        localStorage.setItem('user_target', target);
        const storedUser = getStoredUser();
        if (storedUser) {
            storedUser.learning_target = target;
            localStorage.setItem('user', JSON.stringify(storedUser));
        }
        return data;
    } catch (err) {
        // Fallback to localStorage if offline / endpoint not available
        console.warn('API updateLearningTarget fallback to localStorage:', err);
        localStorage.setItem('user_target', target);
        return { status: 'success', learning_target: target };
    }
};

// === PROFILE API ===

/**
 * Update user profile (name, email, and avatar)
 * @param {Object|number} dataOrUserId - Profile payload { display_name, email, image_path } or user ID
 * @param {string} [name] - Optional name parameter (legacy)
 * @param {string|File} [avatar] - Optional avatar parameter (legacy)
 * @param {string} [email] - Optional email parameter (legacy)
 */
export const updateUserProfile = async (dataOrUserId, name, avatar, email) => {
    let payload = {};
    if (typeof dataOrUserId === 'object' && dataOrUserId !== null) {
        payload = { ...dataOrUserId };
    } else {
        if (name !== undefined) payload.display_name = name;
        if (email !== undefined) payload.email = email;
        if (typeof avatar === 'string') payload.image_path = avatar;
    }

    try {
        const data = await apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(payload),
        });

        // Update stored user in localStorage
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('userId', String(data.id || ''));
            localStorage.setItem('userName', data.display_name || data.username || '');
            localStorage.setItem('userEmail', data.email || '');
            if (data.image_path) {
                localStorage.setItem('userAvatarPath', data.image_path);
            }
        }

        return data;
    } catch (err) {
        console.warn('API updateUserProfile fallback to localStorage:', err);
        const storedUser = getStoredUser() || {};
        const updated = {
            ...storedUser,
            display_name: payload.display_name || storedUser.display_name || localStorage.getItem('userName') || 'Siswa',
            email: payload.email || storedUser.email || localStorage.getItem('userEmail') || 'user@example.com',
            image_path: payload.image_path || storedUser.image_path || localStorage.getItem('userAvatarPath') || '/avatars/characters/char-felix.svg',
        };
        localStorage.setItem('user', JSON.stringify(updated));
        if (updated.display_name) localStorage.setItem('userName', updated.display_name);
        if (updated.email) localStorage.setItem('userEmail', updated.email);
        if (updated.image_path) localStorage.setItem('userAvatarPath', updated.image_path);
        return updated;
    }
};

// === UTILITY EXPORTS ===

export const isAuthenticated = () => {
    return !!getToken();
};

export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};