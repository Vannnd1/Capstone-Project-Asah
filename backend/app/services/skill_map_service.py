"""
Menghitung Skill Map (peta kompetensi) & evaluasi belajar user berdasarkan aktivitas nyata.

Pemetaan journey_id -> kategori skill & kurikulum (sesuai katalog course):
  101 = React Core        (Menjadi React Developer Expert, 4 modul)
  105 = State Management  (Pengembangan Web Modern dengan Next.js, 4 modul)
  103 = API Integration   (Membangun Back-End RESTful API Modern, 4 modul)
  104 = Cloud & DevOps    (Cloud Practitioner Essentials (AWS), 3 modul)
  106 = UI/UX Design      (UI/UX Design Fundamental untuk Web & Mobile, 3 modul)
  102 = Machine Learning  (Belajar Dasar Machine Learning & AI, 3 modul)

Formula skor per domain (skala 0 - 150):
  - Penyelesaian modul unik ('complete') : hingga 120 poin ((completed / total_modules) * 120)
  - Submission / kuis unik ('submit')    : hingga 20 poin (20 poin per submission, maks 20)
  - Aktivitas belajar ('view')           : hingga 10 poin (3 poin per view, maks 10)
"""

import math
from datetime import datetime
from typing import Dict, List, Set
from app.models.activity import Activity
from app.schemas.learning import (
    EvaluationCard,
    GraduationProjection,
    SkillItem,
    SkillMapResponse,
)

CURRICULUM_CATALOG = [
    {
        "journey_id": 101,
        "subject": "React Core",
        "course_name": "Menjadi React Developer Expert",
        "course_name_en": "Becoming a React Developer Expert",
        "category": "Frontend",
        "total_modules": 4,
    },
    {
        "journey_id": 105,
        "subject": "State Management",
        "course_name": "Pengembangan Web Modern dengan Next.js",
        "course_name_en": "Modern Web Development with Next.js",
        "category": "Frontend",
        "total_modules": 4,
    },
    {
        "journey_id": 103,
        "subject": "API Integration",
        "course_name": "Membangun Back-End RESTful API Modern",
        "course_name_en": "Building Modern Back-End RESTful APIs",
        "category": "Backend",
        "total_modules": 4,
    },
    {
        "journey_id": 104,
        "subject": "Cloud & DevOps",
        "course_name": "Cloud Practitioner Essentials (AWS)",
        "course_name_en": "Cloud Practitioner Essentials (AWS)",
        "category": "Cloud & DevOps",
        "total_modules": 3,
    },
    {
        "journey_id": 106,
        "subject": "UI/UX Design",
        "course_name": "UI/UX Design Fundamental untuk Web & Mobile",
        "course_name_en": "UI/UX Design Fundamentals for Web & Mobile",
        "category": "Design",
        "total_modules": 3,
    },
    {
        "journey_id": 102,
        "subject": "Machine Learning",
        "course_name": "Belajar Dasar Machine Learning & AI",
        "course_name_en": "Fundamentals of Machine Learning & AI",
        "category": "AI & Data",
        "total_modules": 3,
    },
]

FULL_MARK = 150
TOTAL_CURRICULUM_MODULES = sum(c["total_modules"] for c in CURRICULUM_CATALOG)

TARGET_CONFIG = {
    "santai": {
        "quota": 1,
        "label_id": "Santai",
        "label_en": "Relaxed",
        "badge_id": "Mode Santai (1 modul/hari)",
        "badge_en": "Relaxed Mode (1 module/day)",
    },
    "fokus": {
        "quota": 3,
        "label_id": "Fokus",
        "label_en": "Focused",
        "badge_id": "Mode Fokus (3 modul/hari)",
        "badge_en": "Focused Mode (3 modules/day)",
    },
    "hardcore": {
        "quota": 5,
        "label_id": "Hardcore",
        "label_en": "Hardcore",
        "badge_id": "Mode Hardcore (5+ modul/hari)",
        "badge_en": "Hardcore Mode (5+ modules/day)",
    },
}


def _build_evaluations(
    strongest: SkillItem | None,
    weakest: SkillItem | None,
    has_activity: bool,
    completed_total: int,
    target: str,
    lang: str,
) -> tuple[EvaluationCard, EvaluationCard, GraduationProjection]:
    is_en = lang == "en"
    t_cfg = TARGET_CONFIG.get(target or "fokus", TARGET_CONFIG["fokus"])
    quota = t_cfg["quota"]
    remaining = max(TOTAL_CURRICULUM_MODULES - completed_total, 0)

    # 1. Strength & Improvement Evaluation Cards
    if not has_activity or strongest is None or weakest is None:
        if is_en:
            strength_eval = EvaluationCard(
                title="Ready to Build Your Profile",
                description=(
                    "No modules have been completed on this account yet. Complete your first module "
                    "in My Courses so AI can accurately map your strengths."
                ),
                is_mastered=False,
            )
            improvement_eval = EvaluationCard(
                title="No Competency Data Yet",
                description=(
                    "All skill scores are currently 0/150. AI recommends starting with "
                    "'Becoming a React Developer Expert' or 'Cloud Practitioner Essentials (AWS)' to establish your baseline."
                ),
                is_mastered=False,
            )
        else:
            strength_eval = EvaluationCard(
                title="Siap Memetakan Kekuatanmu",
                description=(
                    "Belum ada modul yang diselesaikan pada akun ini. Selesaikan modul pertamamu "
                    "di halaman Kelas Saya agar AI dapat mendeteksi kekuatan utamamu secara akurat."
                ),
                is_mastered=False,
            )
            improvement_eval = EvaluationCard(
                title="Belum Ada Data Kompetensi",
                description=(
                    "Skor kompetensi saat ini masih 0/150 di semua bidang. AI merekomendasikan memulai dari "
                    "kelas 'Menjadi React Developer Expert' atau 'Cloud Practitioner Essentials (AWS)'."
                ),
                is_mastered=False,
            )
    else:
        if is_en:
            strength_eval = EvaluationCard(
                title=f"Strength in {strongest.subject}",
                description=(
                    f"Your {strongest.subject} score reached {strongest.score}/{FULL_MARK} "
                    f"({strongest.completed_modules}/{strongest.total_modules} modules completed in "
                    f"'{strongest.course_name_en}'). Your mastery in this area stands out!"
                ),
                skill_subject=strongest.subject,
                score=strongest.score,
                full_mark=FULL_MARK,
                is_mastered=strongest.score >= 120,
            )
            if weakest.score >= 120:
                improvement_eval = EvaluationCard(
                    title="All Core Skills Mastered",
                    description=(
                        f"Every skill domain is at a high level (lowest: {weakest.subject} at {weakest.score}/{FULL_MARK}). "
                        "AI suggests reviewing quizzes and building cross-domain portfolio projects to stay sharp."
                    ),
                    skill_subject=weakest.subject,
                    score=weakest.score,
                    full_mark=FULL_MARK,
                    is_mastered=True,
                )
            elif weakest.completed_modules == 0:
                improvement_eval = EvaluationCard(
                    title=f"{weakest.subject} (Not Started)",
                    description=(
                        f"Your {weakest.subject} score is currently {weakest.score}/{FULL_MARK} "
                        f"(0/{weakest.total_modules} modules completed). AI recommends starting "
                        f"'{weakest.course_name_en}' to make your competency profile more balanced."
                    ),
                    skill_subject=weakest.subject,
                    score=weakest.score,
                    full_mark=FULL_MARK,
                    is_mastered=False,
                )
            else:
                improvement_eval = EvaluationCard(
                    title=f"Strengthen {weakest.subject}",
                    description=(
                        f"Your {weakest.subject} score is currently {weakest.score}/{FULL_MARK} "
                        f"({weakest.completed_modules}/{weakest.total_modules} modules completed in "
                        f"'{weakest.course_name_en}'). Complete the remaining modules and quiz to boost this score."
                    ),
                    skill_subject=weakest.subject,
                    score=weakest.score,
                    full_mark=FULL_MARK,
                    is_mastered=False,
                )
        else:
            strength_eval = EvaluationCard(
                title=f"Keunggulan di {strongest.subject}",
                description=(
                    f"Skor {strongest.subject} mencapai {strongest.score}/{FULL_MARK} "
                    f"({strongest.completed_modules}/{strongest.total_modules} modul kelas "
                    f"'{strongest.course_name}' tuntas). Pemahamanmu di bidang ini sangat menonjol!"
                ),
                skill_subject=strongest.subject,
                score=strongest.score,
                full_mark=FULL_MARK,
                is_mastered=strongest.score >= 120,
            )
            if weakest.score >= 120:
                improvement_eval = EvaluationCard(
                    title="Semua Kompetensi Sudah Kuat",
                    description=(
                        f"Seluruh bidang sudah berada di level tinggi (skor terendah {weakest.subject}: "
                        f"{weakest.score}/{FULL_MARK}). AI menyarankan mengulas kuis atau mengerjakan proyek lintas bidang."
                    ),
                    skill_subject=weakest.subject,
                    score=weakest.score,
                    full_mark=FULL_MARK,
                    is_mastered=True,
                )
            elif weakest.completed_modules == 0:
                improvement_eval = EvaluationCard(
                    title=f"{weakest.subject} (Belum Dimulai)",
                    description=(
                        f"Skor {weakest.subject} saat ini {weakest.score}/{FULL_MARK} "
                        f"(0/{weakest.total_modules} modul selesai). AI merekomendasikan untuk mulai mempelajari "
                        f"kelas '{weakest.course_name}' agar profil kompetensimu lebih seimbang."
                    ),
                    skill_subject=weakest.subject,
                    score=weakest.score,
                    full_mark=FULL_MARK,
                    is_mastered=False,
                )
            else:
                improvement_eval = EvaluationCard(
                    title=f"Tingkatkan {weakest.subject}",
                    description=(
                        f"Skor {weakest.subject} saat ini {weakest.score}/{FULL_MARK} "
                        f"({weakest.completed_modules}/{weakest.total_modules} modul selesai di "
                        f"'{weakest.course_name}'). Tuntaskan modul tersisa dan kuisnya untuk menaikkan skor."
                    ),
                    skill_subject=weakest.subject,
                    score=weakest.score,
                    full_mark=FULL_MARK,
                    is_mastered=False,
                )

    # 2. Dynamic Graduation Projection from real remaining modules
    if remaining == 0:
        days_est = 0
        if is_en:
            eta_text = "Curriculum Completed!"
            proj_desc = (
                f"Congratulations! You have completed all {TOTAL_CURRICULUM_MODULES} curriculum modules. "
                "Keep your skills sharp by reviewing materials and tackling real-world projects."
            )
        else:
            eta_text = "Kurikulum Tuntas!"
            proj_desc = (
                f"Selamat! Kamu telah menuntaskan seluruh {TOTAL_CURRICULUM_MODULES} modul kurikulum. "
                "Pertahankan kompetensimu dengan mengulas materi atau membangun proyek nyata."
            )
    else:
        days_est = math.ceil(remaining / quota)
        weeks_est = math.ceil(days_est / 7)
        if is_en:
            day_word = "Day" if days_est == 1 else "Days"
            week_word = "Week" if weeks_est == 1 else "Weeks"
            eta_text = f"~{days_est} {day_word}" if days_est < 7 else f"~{weeks_est} {week_word} ({days_est} {day_word})"
            proj_desc = (
                f"You have completed {completed_total} of {TOTAL_CURRICULUM_MODULES} modules "
                f"({remaining} modules remaining). At your {t_cfg['label_en']} target ({quota}/day), "
                f"AI projects full curriculum completion in {eta_text}."
            )
        else:
            eta_text = f"~{days_est} Hari" if days_est < 7 else f"~{weeks_est} Minggu ({days_est} Hari)"
            proj_desc = (
                f"Kamu telah menyelesaikan {completed_total} dari {TOTAL_CURRICULUM_MODULES} modul "
                f"({remaining} modul tersisa). Dengan target {t_cfg['label_id']} ({quota} modul/hari), "
                f"AI memproyeksikan seluruh materi dapat tuntas dalam {eta_text}."
            )

    graduation_proj = GraduationProjection(
        eta_text=eta_text,
        badge=t_cfg["badge_en"] if is_en else t_cfg["badge_id"],
        description=proj_desc,
        remaining_modules=remaining,
        completed_modules=completed_total,
        total_modules=TOTAL_CURRICULUM_MODULES,
        days_estimated=days_est,
    )

    return strength_eval, improvement_eval, graduation_proj


def calculate_skill_map(
    activities: List[Activity],
    target: str = "fokus",
    lang: str = "id",
) -> SkillMapResponse:
    completed_by_journey: Dict[int, Set[int]] = {c["journey_id"]: set() for c in CURRICULUM_CATALOG}
    submitted_by_journey: Dict[int, Set[int]] = {c["journey_id"]: set() for c in CURRICULUM_CATALOG}
    views_by_journey: Dict[int, int] = {c["journey_id"]: 0 for c in CURRICULUM_CATALOG}

    for act in activities:
        jid = act.journey_id
        if jid not in completed_by_journey:
            continue
        if act.action == "complete":
            completed_by_journey[jid].add(act.tutorial_id)
        elif act.action == "submit":
            submitted_by_journey[jid].add(act.tutorial_id)
        elif act.action == "view":
            views_by_journey[jid] += 1

    skills: List[SkillItem] = []
    total_completed_curriculum = 0

    for course in CURRICULUM_CATALOG:
        jid = course["journey_id"]
        total_mods = course["total_modules"]
        done_count = min(len(completed_by_journey[jid]), total_mods)
        sub_count = len(submitted_by_journey[jid])
        view_count = views_by_journey[jid]

        total_completed_curriculum += done_count

        completion_score = round((done_count / total_mods) * 120) if total_mods > 0 else 0
        submit_bonus = min(sub_count * 20, 20)
        view_bonus = min(view_count * 3, 10)
        score = min(completion_score + submit_bonus + view_bonus, FULL_MARK)
        completion_pct = round((done_count / total_mods) * 100) if total_mods > 0 else 0

        skills.append(
            SkillItem(
                journey_id=jid,
                subject=course["subject"],
                course_name=course["course_name"],
                course_name_en=course["course_name_en"],
                category=course["category"],
                score=score,
                full_mark=FULL_MARK,
                completed_modules=done_count,
                total_modules=total_mods,
                completion_pct=completion_pct,
                submissions=sub_count,
            )
        )

    has_activity = any(s.score > 0 for s in skills)
    strongest = max(skills, key=lambda s: (s.score, s.completion_pct, s.completed_modules)) if has_activity else None
    weakest = min(skills, key=lambda s: (s.score, s.completion_pct, s.completed_modules)) if has_activity else None

    strength_eval, improvement_eval, graduation_proj = _build_evaluations(
        strongest=strongest,
        weakest=weakest,
        has_activity=has_activity,
        completed_total=total_completed_curriculum,
        target=target,
        lang=lang,
    )

    return SkillMapResponse(
        skills=skills,
        strongest=strongest,
        weakest=weakest,
        has_activity=has_activity,
        total_curriculum_modules=TOTAL_CURRICULUM_MODULES,
        completed_curriculum_modules=total_completed_curriculum,
        strength_evaluation=strength_eval,
        improvement_evaluation=improvement_eval,
        graduation_projection=graduation_proj,
        generated_at=datetime.utcnow(),
    )
