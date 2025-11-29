    // URL dasar tempat backend berjalan: http://localhost:3001/api/v1
    const BASE_URL = 'http://localhost:3001/api/v1'; 

    // Fungsi inti untuk menangani semua request Fetch
    const apiRequest = async (endpoint, options) => {
        const url = `${BASE_URL}${endpoint}`;
        
        // Kita gunakan userId sebagai kunci otentikasi sementara (pengganti JWT Token)
        const userId = localStorage.getItem('userId'); 

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Dalam sistem asli, ini harusnya Token JWT, tapi kita biarkan header otentikasi minimal
        // if (userId) { headers['X-User-ID'] = userId; } // Contoh jika backend memerlukannya

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
        // Mengembalikan seluruh objek data (termasuk data.user)
        return data; 
    };

    export const register = async (name, email, password) => {
        // Endpoint: POST /api/v1/auth/register
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        // Mengembalikan data respons
        return data;
    };

    // --- API DATA (Contoh, untuk fetch data Dashboard) ---
    export const fetchDashboardStats = async () => {
        // Endpoint: GET /api/v1/dashboard/stats (Contoh)
        return apiRequest('/dashboard/stats', {
            method: 'GET',
        });
    };

// --- API PROFILE (UPDATED WITH FILE UPLOAD) ---
export const updateUserProfile = async (userId, name, file) => {
    // Gunakan FormData untuk kirim file + text
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('name', name);
    
    // Jika ada file gambar baru yang dipilih
    if (file) {
        formData.append('avatar', file); // 'avatar' harus sama dengan di route backend
    }

    // Endpoint: PUT /api/v1/profile/update
    // PENTING: Jangan set Content-Type header manual, biarkan fetch yang atur boundary FormData
    const token = localStorage.getItem('token'); // Jika pakai token

    const response = await fetch(`${BASE_URL}/profile/update`, {
        method: 'PUT',
        body: formData,
        // headers: { ... } // Biasanya headers kosong untuk FormData (kecuali Auth Token)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal update profil');
    }

    return response.json();
};