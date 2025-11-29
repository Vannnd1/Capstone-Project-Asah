const supabase = require('../config/supabaseClient');

const updateProfile = async (req, res) => {
    try {
        const { user_id, name } = req.body;
        const file = req.file; // File gambar dari frontend

        if (!user_id) {
            return res.status(400).json({ message: "User ID wajib ada!" });
        }

        let publicUrl = null;

        // 1. JIKA ADA FILE DI-UPLOAD
        if (file) {
            // Nama file unik: avatar_[userid]_[timestamp]
            const fileName = `avatar_${user_id}_${Date.now()}`;
            
            // Upload ke Supabase Storage (Bucket 'avatars')
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('avatars')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype
                });

            if (uploadError) throw uploadError;

            // Ambil URL Publik
            const { data: urlData } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(fileName);
                
            publicUrl = urlData.publicUrl;
        }

        // 2. Update Data User di Database
        // Buat object update dinamis
        const updateData = { name: name };
        if (publicUrl) {
            updateData.image_path = publicUrl; // Hanya update foto jika ada upload baru
        }

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', user_id)
            .select();

        if (error) throw error;

        res.status(200).json({
            message: "Profil berhasil diperbarui!",
            data: data[0] // Kirim data user terbaru
        });

    } catch (error) {
        console.error("Error Update Profile:", error);
        res.status(500).json({ message: "Gagal update profil", error: error.message });
    }
};

module.exports = { updateProfile };