const users = require('../data/users.json');
const insights = require('../data/mockMLInsights.json');

const getDashboardData = (req, res) => {
  try {
    // ambil userId dari parameter URL (cth: /api/v1/dashboard/R891D5Y1908)
    const { userId } = req.params;

    // cari data pengguna
    const user = users.find(u => u.user_id === userId);

    // insight
    const mlInsight = insights[userId];

    // validasi
    if (!user || !mlInsight) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // gabungkan data
    const dashboardData = {
      user: {
        name: user.name,
        id: user.user_id
      },
      ...mlInsight // gabungkan semua properti dari mlInsight
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