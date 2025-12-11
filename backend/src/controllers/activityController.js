const supabase = require('../config/supabaseClient');

const recordActivity = async (req, res) => {
    try {
        // Data yang dikirim dari Frontend
        const { user_id, module_id, score, time_spent_seconds } = req.body;

        // Validasi sederhana
        if (!user_id || !module_id) {
            return res.status(400).json({ message: "User ID dan Module ID wajib diisi" });
        }

        // Insert ke Supabase
        const { data, error } = await supabase
            .from('user_activities')
            .insert([{
                user_id,
                module_id,
                score: score || 0, // Default 0 jika tidak ada nilai (misal baca materi biasa)
                time_spent_seconds: time_spent_seconds || 0,
                completed_at: new Date() // Waktu sekarang
            }])
            .select();

        if (error) throw error;

        res.status(201).json({ 
            message: "Aktivitas berhasil dicatat!", 
            data: data[0] 
        });

    } catch (error) {
        console.error("Error recording activity:", error);
        res.status(500).json({ message: "Gagal mencatat aktivitas", error: error.message });
    }
};

module.exports = { recordActivity };