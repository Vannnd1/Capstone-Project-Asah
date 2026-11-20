// Service untuk mengelola progres belajar siswa secara dinamis & persisten di Kelas Saya
import { mockJourneys, mockTutorials } from '../mockData';
import * as api from './ApiService';

const STORAGE_KEY = 'user_completed_modules';

// Inisialisasi awal modul yang selesai jika pengguna baru membuka aplikasi
// Memberikan progres yang realistis pada beberapa kelas
const DEFAULT_INITIAL_COMPLETED = [1, 2, 5, 12, 13, 14, 15, 19, 20];

/**
 * Mendapatkan daftar ID tutorial/modul yang sudah diselesaikan
 */
export const getCompletedModules = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Simpan default pertama kali
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_COMPLETED));
        return DEFAULT_INITIAL_COMPLETED;
    } catch (e) {
        return DEFAULT_INITIAL_COMPLETED;
    }
};

/**
 * Cek apakah modul tertentu sudah diselesaikan
 */
export const isModuleCompleted = (moduleId) => {
    const list = getCompletedModules();
    return list.includes(Number(moduleId));
};

/**
 * Toggle status penyelesaian modul (selesai / belum selesai)
 * dan kirim telemetri aktivitas ke backend
 */
export const toggleModuleCompleted = async (moduleId, journeyId) => {
    const numModuleId = Number(moduleId);
    const numJourneyId = Number(journeyId);
    let list = getCompletedModules();
    const isAlreadyDone = list.includes(numModuleId);

    if (isAlreadyDone) {
        list = list.filter(id => id !== numModuleId);
    } else {
        list = [...list, numModuleId];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Kirim telemetri ke backend jika menandai selesai
    if (!isAlreadyDone) {
        try {
            await api.logActivity({
                journey_id: numJourneyId,
                tutorial_id: numModuleId,
                action: 'complete',
                duration_seconds: 600,
            });
        } catch (err) {
            console.warn('Gagal mencatat log aktivitas modul:', err);
        }
    }

    // Trigger event agar komponen lain langsung update secara reaktif
    window.dispatchEvent(new CustomEvent('course-progress-updated', {
        detail: { moduleId: numModuleId, journeyId: numJourneyId, isCompleted: !isAlreadyDone }
    }));

    return !isAlreadyDone;
};

/**
 * Hitung statistik progres suatu kelas berdasarkan modul yang selesai
 */
export const getJourneyProgress = (journeyId) => {
    const modules = mockTutorials.filter(m => m.journey_id === Number(journeyId));
    const completedList = getCompletedModules();
    
    const totalCount = modules.length;
    if (totalCount === 0) {
        return { completedCount: 0, totalCount: 0, percentage: 0, isCompleted: false };
    }

    const completedCount = modules.filter(m => completedList.includes(m.id)).length;
    const percentage = Math.min(100, Math.round((completedCount / totalCount) * 100));

    return {
        completedCount,
        totalCount,
        percentage,
        isCompleted: completedCount === totalCount && totalCount > 0,
    };
};

/**
 * Mengambil semua data kelas dengan progres dinamis terkini
 */
export const getAllJourneysWithProgress = () => {
    return mockJourneys.map(journey => {
        const { completedCount, totalCount, percentage, isCompleted } = getJourneyProgress(journey.id);
        
        let status = 'not_started';
        if (isCompleted) {
            status = 'completed';
        } else if (percentage > 0) {
            status = 'active';
        }

        return {
            ...journey,
            total_modules: totalCount || journey.total_modules,
            completed_modules: completedCount,
            progress: percentage,
            status,
        };
    });
};

/**
 * Mendapatkan ringkasan statistik keseluruhan progres siswa
 */
export const getStudentProgressSummary = () => {
    const journeys = getAllJourneysWithProgress();
    const completedList = getCompletedModules();

    const totalCourses = journeys.length;
    const completedCourses = journeys.filter(j => j.progress === 100).length;
    const inProgressCourses = journeys.filter(j => j.progress > 0 && j.progress < 100).length;
    const notStartedCourses = journeys.filter(j => j.progress === 0).length;

    const totalPercentageSum = journeys.reduce((sum, j) => sum + j.progress, 0);
    const averageProgress = totalCourses > 0 ? Math.round(totalPercentageSum / totalCourses) : 0;

    return {
        totalCourses,
        completedCourses,
        inProgressCourses,
        notStartedCourses,
        averageProgress,
        totalModulesDone: completedList.length,
    };
};
