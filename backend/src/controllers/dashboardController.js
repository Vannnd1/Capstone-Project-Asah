const supabase = require('../config/supabaseClient');

// --- HELPER: LOGIC AGREGASI CHART ---
const processChartData = (activities) => {
    // 1. Inisialisasi Struktur Data
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const currentMonthIdx = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthName = MONTHS[currentMonthIdx]; // e.g., "Des"

    // Array penghitung (Counter)
    const dailyCounts = [0, 0, 0, 0, 0, 0, 0]; // Ming(0) s.d Sab(6)
    const weeklyCounts = [0, 0, 0, 0]; // Mgg 1 - 4
    const yearlyCounts = new Array(12).fill(0); // Jan - Des

    // 2. Loop Data Mentah dari DB
    activities.forEach(act => {
        const date = new Date(act.created_at);
        const month = date.getMonth();
        const year = date.getFullYear();
        const day = date.getDay(); // 0 = Minggu, 1 = Senin
        const dateNum = date.getDate();

        // A. Hitung Yearly (Hanya tahun ini)
        if (year === currentYear) {
            yearlyCounts[month] += 1;
        }

        // B. Hitung Daily & Weekly (Hanya bulan ini)
        if (year === currentYear && month === currentMonthIdx) {
            // Daily: Langsung tambah ke index hari (0-6)
            dailyCounts[day] += 1;

            // Weekly: (Tanggal-1) / 7. Contoh tgl 1-7 = index 0
            let weekIdx = Math.floor((dateNum - 1) / 7);
            if (weekIdx > 3) weekIdx = 3; // Sisa hari masuk minggu ke-4
            weeklyCounts[weekIdx] += 1;
        }
    });

    // 3. Format Agar Sesuai Recharts (Frontend)
    // Recharts butuh array object: [{ label: 'Sen', value: 5 }, ...]
    
    // Urutkan Hari: Sen (1) sampai Sab (6), lalu Min (0) ditaruh terakhir/awal sesuai selera.
    // Di sini kita pakai urutan Sen -> Min
    const daysLabel = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const formattedDaily = [
        { label: 'Sen', value: dailyCounts[1] },
        { label: 'Sel', value: dailyCounts[2] },
        { label: 'Rab', value: dailyCounts[3] },
        { label: 'Kam', value: dailyCounts[4] },
        { label: 'Jum', value: dailyCounts[5] },
        { label: 'Sab', value: dailyCounts[6] },
        { label: 'Min', value: dailyCounts[0] },
    ];

    const formattedWeekly = weeklyCounts.map((val, i) => ({
        label: `Mgg ${i + 1}`,
        value: val
    }));

    const formattedYearly = yearlyCounts.map((val, i) => ({
        label: MONTHS[i],
        value: val
    }));

    return {
        monthName: currentMonthName,
        daily: formattedDaily,
        weekly: formattedWeekly,
        yearly: formattedYearly
    };
};

// --- CONTROLLER UTAMA ---
const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Cek User
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // 2. Ambil Aktivitas (Bahan Chart)
    const { data: activities, error: actError } = await supabase
      .from('user_activities')
      .select('score, time_spent_seconds, created_at')
      .eq('user_id', userId);
    
    if (actError) throw actError;

    // 3. Proses Statistik (Total & Rata-rata)
    let totalSec = 0, totalScore = 0, quizCount = 0;
    if (activities) {
        activities.forEach(a => {
            totalSec += (a.time_spent_seconds || 0);
            if (a.score > 0) {
                totalScore += a.score;
                quizCount++;
            }
        });
    }
    const avgScore = quizCount ? Math.round(totalScore / quizCount) : 0;
    const totalHours = (totalSec / 3600).toFixed(1);

    // 4. Proses Chart (Panggil Helper)
    const chartData = processChartData(activities || []);

    // 5. Ambil AI Insight (Dari tabel Mock DB)
    const { data: insightData } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    // Default jika insight belum ada
    const finalInsight = insightData || {
        learning_style: "Belum Ada Data",
        insight_text: "Selesaikan modul untuk mendapatkan analisis AI.",
        recommendation: "Mulai belajar sekarang!",
        color: "gray" // Tambahan properti warna untuk frontend
    };

    // 6. Susun Response Final
    res.status(200).json({
        user: {
            name: user.name,
            email: user.email,
            id: user.id
        },
        // Data Insight
        learningStyle: finalInsight.learning_style,
        insightText: finalInsight.insight_text,
        recommendation: finalInsight.recommendation,
        color: finalInsight.learning_style === 'consistent_learner' ? 'blue' : 'green', // Logic warna sederhana
        
        // Data Statistik
        statistics: {
            avgScore,
            totalHours
        },
        
        // Data Chart (Dinamis Bulan Ini)
        charts: {
            [chartData.monthName]: {
                daily: chartData.daily,
                weekly: chartData.weekly
            }
        },
        yearly: chartData.yearly
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getDashboardData };