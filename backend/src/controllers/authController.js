const supabase = require('../config/supabaseClient');

// register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Data tidak lengkap!" });
        }

        // 1. Cek apakah email sudah ada di DB
        // SQL: SELECT * FROM users WHERE email = '...'
        const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(409).json({ message: "Email sudah terdaftar!" });
        }

        // 2. Masukkan user baru
        // SQL: INSERT INTO users (name, email, password) VALUES (...)
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ name, email, password }])
            .select() // Minta data balikan setelah insert
            .single();

        if (error) throw error;

        res.status(201).json({ 
            message: "Registrasi berhasil!", 
            user: { 
                name: newUser.name, 
                user_id: newUser.id // Supabase otomatis bikin ID uuid
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal registrasi", error: error.message });
    }
};

// login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email dan Password wajib diisi!" });
        }

        // 1. Cari user berdasarkan email
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single(); // single() artinya kita cuma harap dapat 1 data

        // 2. Cek apakah user ketemu
        if (!user || error) {
            return res.status(401).json({ message: "Email atau Password salah!" });
        }

        // 3. Cek password manual (Sederhana)
        if (user.password !== password) {
            return res.status(401).json({ message: "Email atau Password salah!" });
        }

        // 4. Sukses
        res.status(200).json({
            message: "Login berhasil!",
            user: {
                user_id: user.id, // Pakai ID dari Supabase
                name: user.name,
                email: user.email,
                image_path: user.image_path
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

module.exports = { register, login };