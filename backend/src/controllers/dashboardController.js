const supabase = require('../config/supabaseClient');
const insights = require('../data/mockMLInsights.json');
const dashboardStats = require('../data/mockDataDashboard.json')

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

    const defaultId = "R891D5Y1908";

    let userInsight = insights[userId] || insights[defaultId];
    let userStats = dashboardStats[userId] || dashboardStats[defaultId];

    // gabungkan data
    const fullDashboardData = {
      user: {
        name: user.name,
        id: user.id,
        email: user.email
      },
      ...userInsight, // Gabungkan data insight
      statistics: userStats.stats,
      charts: userStats.charts,
      yearly: userStats.yearly
    };

    // kirim kembali ke frontend
    res.status(200).json(fullDashboardData);

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

module.exports = {
  getDashboardData
};