const supabase = require('../config/supabaseClient');
const insights = require('../data/mockMLInsights.json');

const getDashboardData = async (req, res) => {
  try {
    // ambil userId dari parameter URL (cth: /api/v1/dashboard/R891D5Y1908)
    const { userId } = req.params;

    // cari data pengguna
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single();

    // Jika user tidak ditemukan di database Supabase
    if (error || !user) {
      return res.status(404).json({ message: "User tidak ditemukan di Database" });
    }

    // 3. Cari data insight
    // Masalah: ID di mockMlInsights.json pakai format lama, sedangkan user.id sekarang UUID.
    // Solusi Sementara: Kita ambil insight milik 'Tezar' (R891D5Y1908) sebagai default/contoh
    // supaya dashboard tetap ada isinya.
    let userInsight = insights[userId]; 

    // Jika tidak ada insight khusus buat ID ini (karena user baru), pakai default:
    if (!userInsight) {
        // Ambil data dummy pertama sebagai contoh
        userInsight = insights["R891D5Y1908"] || {
            learningStyle: "belum_terdeteksi",
            insightText: "Halo! Karena kamu pengguna baru, AI sedang menganalisis data belajarmu.",
            recommendation: "Mulai kerjakan kuis pertama untuk melihat hasil."
        };
    }

    // gabungkan data
    const dashboardData = {
      user: {
        name: user.name,
        id: user.id,
        email: user.email
      },
      ...userInsight // Gabungkan data insight
    };

    // kirim kembali ke frontend
    res.status(200).json(dashboardData);

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = {
  getDashboardData
};