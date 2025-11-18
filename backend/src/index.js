const express = require('express');
const cors = require('cors');

// Impor rute
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = 3001; // Port untuk backend sementara

// === Middleware ===
app.use(cors()); // Izinkan koneksi dari 'origin' (React) yang berbeda
app.use(express.json()); // Izinkan server membaca body JSON

// === Routes ===
// Hubungkan rute kita ke URL dasar
app.use('/api/v1/dashboard', dashboardRoutes);

// === Jalankan Server ===
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});