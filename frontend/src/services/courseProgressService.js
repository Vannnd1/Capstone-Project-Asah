// Service untuk mengelola progres belajar siswa secara dinamis & tersinkronisasi per akun
import { mockJourneys, mockTutorials } from '../mockData';
import * as api from './ApiService';

const getStorageKey = (userId) => {
    const activeId = userId || localStorage.getItem('userId') || 'guest';
    return `user_completed_modules_${activeId}`;
};

/**
 * Sinkronkan daftar modul selesai dari aktivitas backend milik akun aktif
 */
export const syncCompletedModulesFromActivities = (activities = [], userId) => {
    if (!Array.isArray(activities)) return [];
    const completedIds = Array.from(
        new Set(
            activities
                .filter((a) => a.action === 'complete')
                .map((a) => Number(a.tutorial_id))
                .filter((id) => !Number.isNaN(id))
        )
    );
    try {
        localStorage.setItem(getStorageKey(userId), JSON.stringify(completedIds));
    } catch (e) {
        console.warn('Gagal menyimpan cache progres modul:', e);
    }
    window.dispatchEvent(new CustomEvent('course-progress-synced', {
        detail: { completedIds }
    }));
    return completedIds;
};

/**
 * Mendapatkan daftar ID tutorial/modul yang sudah diselesaikan untuk akun aktif
 */
export const getCompletedModules = (userId) => {
    try {
        const stored = localStorage.getItem(getStorageKey(userId));
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
        return [];
    } catch (e) {
        return [];
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
 * dan sinkronkan langsung ke aktivitas backend akun aktif
 */
export const toggleModuleCompleted = async (moduleId, journeyId) => {
    const numModuleId = Number(moduleId);
    const numJourneyId = Number(journeyId);
    let list = getCompletedModules();
    const isAlreadyDone = list.includes(numModuleId);

    if (isAlreadyDone) {
        list = list.filter((id) => id !== numModuleId);
    } else {
        list = [...list, numModuleId];
    }

    try {
        localStorage.setItem(getStorageKey(), JSON.stringify(list));
    } catch (e) {
        console.warn('Gagal menyimpan progres lokal:', e);
    }

    // Sinkronkan ke backend agar telemetri, skill map, dan AI insight ikut terbarui
    try {
        if (!isAlreadyDone) {
            await api.logActivity({
                journey_id: numJourneyId,
                tutorial_id: numModuleId,
                action: 'complete',
                duration_seconds: 600,
            });
        } else {
            await api.removeActivity(numJourneyId, numModuleId, 'complete');
        }
    } catch (err) {
        console.warn('Gagal menyinkronkan aktivitas modul ke backend:', err);
    }

    // Trigger event agar halaman Kelas Saya & LearningContext langsung update
    window.dispatchEvent(new CustomEvent('course-progress-updated', {
        detail: { moduleId: numModuleId, journeyId: numJourneyId, isCompleted: !isAlreadyDone }
    }));

    return !isAlreadyDone;
};

/**
 * Hitung statistik progres suatu kelas berdasarkan modul yang selesai
 */
export const getJourneyProgress = (journeyId) => {
    const modules = mockTutorials.filter((m) => m.journey_id === Number(journeyId));
    const completedList = getCompletedModules();

    const totalCount = modules.length;
    if (totalCount === 0) {
        return { completedCount: 0, totalCount: 0, percentage: 0, isCompleted: false };
    }

    const completedCount = modules.filter((m) => completedList.includes(m.id)).length;
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
    return mockJourneys.map((journey) => {
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
    const completedCourses = journeys.filter((j) => j.progress === 100).length;
    const inProgressCourses = journeys.filter((j) => j.progress > 0 && j.progress < 100).length;
    const notStartedCourses = journeys.filter((j) => j.progress === 0).length;

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
