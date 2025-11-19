const fs = require('fs');
const path = require('path');

// users.json
const usersFilePath = path.join(__dirname, '../data/users.json');

// membaca data user terbaru
const getUsersData = () => {
    const jsonData = fs.readFileSync(usersFilePath);
    return JSON.parse(jsonData);
};

// menyimpan data user (menimpa file)
const saveUsersData = (data) => {
    const stringifyData = JSON.stringify(data, null, 2); // null, 2 agar rapi (pretty print)
    fs.writeFileSync(usersFilePath, stringifyData);
};

// register
const register = (req, res) => {
    try {
        // 1. Tangkap data dari Body Request (Postman/Frontend)
        const { name, email, password } = req.body;

        // 2. Validasi sederhana (Pastikan data tidak kosong)
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Nama, Email, dan Password wajib diisi!" });
        }

        // 3. Ambil data user yang sudah ada
        const users = getUsersData();

        // 4. Cek apakah email sudah terdaftar (Opsional tapi bagus)
        const emailExists = users.find(user => user.email === email);
        if (emailExists) {
            return res.status(409).json({ message: "Email sudah terdaftar!" });
        }

        // 5. Buat User Baru
        // generate ID unik sederhana (sementara)
        const newUser = {
            user_id: `U-${Date.now()}`, 
            name: name,
            email: email,
            password: password // note: not using hash yet (next feat)
        };

        // 6. Masukkan user baru ke array
        users.push(newUser);

        // 7. Simpan kembali ke file JSON (Write)
        saveUsersData(users);

        // 8. Respon sukses
        res.status(201).json({ 
            message: "Registrasi berhasil!", 
            user: {
                name: newUser.name,
                user_id: newUser.user_id
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mendaftarkan user", error: error.message });
    }
};

// login
const login = (req, res) => {
    try {
        // 1. Ambil email & password dari body
        const { email, password } = req.body;

        // 2. Validasi input kosong
        if (!email || !password) {
            return res.status(400).json({ message: "Email dan Password wajib diisi!" });
        }

        // 3. Ambil data users
        const users = getUsersData();

        // 4. Cari user berdasarkan email
        const user = users.find(u => u.email === email);

        // 5. Cek apakah user ketemu DAN password cocok
        // note**: next feat -> password harus di-compare hash-nya, bukan plain text)
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Email atau Password salah!" });
        }

        // 6. Login Sukses!
        // Kirim balik data user (KECUALI password)
        res.status(200).json({
            message: "Login berhasil!",
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

module.exports = { register, login };