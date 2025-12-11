// URL dasar tempat backend berjalan
const BASE_URL = 'http://localhost:3001/api/v1';

// Fungsi inti untuk menangani semua request Fetch
const apiRequest = async (endpoint, options) => {
    const url = `${BASE_URL}${endpoint}`;
    
    // Kita gunakan userId sebagai kunci otentikasi sementara
    const userId = localStorage.getItem('userId');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    // Handle respons 4xx atau 5xx
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error(`Server Error (${response.status})`);
        }
        throw new Error(errorData.message || 'Terjadi kesalahan pada server.');
    }

    // Mengembalikan data JSON dari respons
    return response.json();
};

// --- API AUTHENTIKASI ---

export const login = async (email, password) => {
    // Endpoint: POST /api/v1/auth/login
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return data; 
};

export const register = async (name, email, password) => {
    // Endpoint: POST /api/v1/auth/register
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
    return data;
};

// --- API PROFILE ---
export const updateUserProfile = async (userId, name, file) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('name', name);
    
    if (file) {
        formData.append('avatar', file); 
    }

    // Endpoint: PUT /api/v1/profile/update
    const response = await fetch(`${BASE_URL}/profile/update`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal update profil');
    }

    return response.json();
};

// --- API DATA DASHBOARD (BARU) ---
export const getDashboardData = async (userId) => {
    // Endpoint: GET /api/v1/dashboard/[USER_ID]
    return apiRequest(`/dashboard/${userId}`, {
        method: 'GET',
    });
};