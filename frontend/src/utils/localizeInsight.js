/**
 * Utility untuk menerjemahkan insight dan rekomendasi AI
 * sehingga konsisten saat beralih antara Bahasa Indonesia dan English
 */

export const localizeInsightText = (text, lang = 'id', context = {}) => {
  if (!text || typeof text !== 'string') return text;
  if (lang !== 'en') return text;

  // Pattern 1: Standar Mock Server / Backend: "Luar biasa, [Name]! Dengan target [target], kamu sudah menyelesaikan [done] dari [quota] modul harianmu. Pertahankan ritme produktif ini hari ini!"
  const regex1 = /Luar biasa,\s*([^!]+)!\s*Dengan target\s*([^,]+),\s*kamu sudah menyelesaikan\s*(\d+)\s*dari\s*(\d+)\s*modul harianmu\.\s*Pertahankan ritme produktif ini hari ini!/i;
  const match1 = text.match(regex1);
  if (match1) {
    const [, name, targetLabel, done, quota] = match1;
    let targetEn = targetLabel;
    if (/santai/i.test(targetLabel)) targetEn = "Relaxed (1 module/day)";
    else if (/fokus/i.test(targetLabel)) targetEn = "Focused (3 modules/day)";
    else if (/hardcore/i.test(targetLabel)) targetEn = "Hardcore (5+ modules/day)";

    return `Outstanding, ${name.trim()}! With your ${targetEn} target, you have completed ${done} of ${quota} daily modules. Keep up this productive rhythm today!`;
  }

  // Pattern 2: Built-in fast learner
  if (text.includes("Ritme belajarmu sangat cepat")) {
    return text
      .replace(/Luar biasa,\s*([^!]+)!/gi, "Outstanding, $1!")
      .replace(/Ritme belajarmu sangat cepat\./gi, "Your learning pace is remarkably swift.")
      .replace(/Target harianmu \((\d+) modul\) sudah tercapai hari ini!/gi, "Your daily target ($1 modules) has been achieved today!")
      .replace(/Hari ini kamu sudah menyelesaikan (\d+)\/(\d+) modul\. Sedikit lagi menuju target harian!/gi, "You have completed $1/$2 modules today. Almost at your daily target!")
      .replace(/Target belajarmu adalah mode ([^()]+)\s*\(([^()]+)\)\./gi, "Your learning target is mode $1 ($2).")
      .replace(/Tantang dirimu dengan mini project untuk memperdalam pemahaman praktis!/gi, "Challenge yourself with mini projects to deepen practical mastery!");
  }

  // Pattern 3: Consistent learner
  if (text.includes("Konsistensi belajarmu sangat stabil")) {
    return text
      .replace(/Hebat,\s*([^!]+)!/gi, "Great job, $1!")
      .replace(/Konsistensi belajarmu sangat stabil\./gi, "Your study consistency is exceptionally steady.")
      .replace(/Target harianmu \((\d+) modul\) sudah tercapai hari ini!/gi, "Your daily target ($1 modules) has been achieved today!")
      .replace(/Hari ini kamu sudah menyelesaikan (\d+)\/(\d+) modul\. Sedikit lagi menuju target harian!/gi, "You have completed $1/$2 modules today. Almost at your daily target!")
      .replace(/Pertahankan kebiasaan produktif ini untuk mencapai target mingguanmu secara teratur\./gi, "Maintain this productive habit to consistently hit your weekly milestones.");
  }

  // Pattern 4: Reflective learner
  if (text.includes("Kamu mempelajari setiap konsep secara mendalam")) {
    return text
      .replace(/Bagus sekali,\s*([^!]+)!/gi, "Excellent, $1!")
      .replace(/Kamu mempelajari setiap konsep secara mendalam\./gi, "You absorb every concept thoroughly.")
      .replace(/Eksplorasi modul lanjutan saat kamu merasa sudah menguasai konsep dasarnya\./gi, "Explore advanced modules once you feel confident in the foundational concepts.");
  }

  // Pattern 5: Passive / General
  if (text.includes("Langkah kecil yang konsisten")) {
    return text
      .replace(/Semangat,\s*([^!]+)!/gi, "Keep it up, $1!")
      .replace(/Langkah kecil yang konsisten akan membangun momentum belajar yang luar biasa!/gi, "Consistent small steps build tremendous learning momentum!");
  }

  // Pattern 6: History items
  if (text.includes("Kamu menunjukkan ritme belajar yang sangat konsisten")) {
    return "You demonstrate a remarkably consistent study rhythm with high material retention.";
  }
  if (text.includes("Berhasil menyelesaikan modul dasar dengan skor quiz 95%!")) {
    return "Successfully completed foundational modules with a 95% quiz score!";
  }

  // If already in English or not matched, return as is
  return text;
};

/**
 * Menerjemahkan alasan rekomendasi course ke bahasa Inggris
 */
export const localizeRecommendationReason = (reason, lang = 'id') => {
  if (!reason || lang !== 'en') return reason;

  const dictionary = {
    "Melengkapi keahlian komputasi awan setelah menyelesaikan dasar Back-End.":
      "Complements cloud architecture expertise after mastering Back-End foundations.",
    "Mendukung pemahaman visual untuk frontend React.":
      "Enhances visual design proficiency for React frontend development.",
    "Langkah berikutnya untuk mendalami arsitektur serverless.":
      "The next logical milestone for diving into serverless architectures.",
    "Kombinasi ideal untuk pengembangan web modern skala penuh.":
      "An ideal combination for full-stack modern web engineering."
  };

  return dictionary[reason] || reason;
};
