from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.activity import Activity
from app.services.auth_service import hash_password
from app.routes.auth import router as auth_router
from app.routes.learning import router as learning_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

def ensure_schema_migrations():
    from sqlalchemy import text
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN learning_target VARCHAR(20) DEFAULT 'fokus'"))
            conn.commit()
    except Exception:
        pass

ensure_schema_migrations()

# Seed demo user and realistic initial activities if empty
def seed_demo_user():
    db = SessionLocal()
    try:
        demo = db.query(User).filter(User.username == "siswa_demo").first()
        if not demo:
            demo = User(
                username="siswa_demo",
                email="siswa@dicoding.com",
                hashed_password=hash_password("password123"),
                display_name="Siswa Teladan",
                image_path="/avatars/characters/char-felix.svg"
            )
            db.add(demo)
            db.commit()
            db.refresh(demo)

        # Seed realistic learning activities for demo user if they have no activity rows yet
        if demo and db.query(Activity).filter(Activity.user_id == demo.id).count() == 0:
            now = datetime.utcnow()
            demo_activities = [
                # Day -5: AWS Cloud Practitioner (modules 12, 13, 14 + quiz submit)
                (104, 12, "view", 900, now - timedelta(days=5, hours=2)),
                (104, 12, "complete", 900, now - timedelta(days=5, hours=1)),
                (104, 13, "view", 1440, now - timedelta(days=5)),
                (104, 13, "complete", 1440, now - timedelta(days=5)),
                (104, 14, "view", 1500, now - timedelta(days=4, hours=2)),
                (104, 14, "submit", 1500, now - timedelta(days=4, hours=1)),
                (104, 14, "complete", 1500, now - timedelta(days=4, hours=1)),
                # Day -3: React Core (modules 1, 2)
                (101, 1, "view", 765, now - timedelta(days=3, hours=2)),
                (101, 1, "complete", 765, now - timedelta(days=3, hours=1)),
                (101, 2, "view", 1080, now - timedelta(days=3)),
                (101, 2, "complete", 1080, now - timedelta(days=3)),
                # Day -2: Next.js & ML (modules 15, 5)
                (105, 15, "view", 1100, now - timedelta(days=2, hours=1)),
                (105, 15, "complete", 1100, now - timedelta(days=2, hours=1)),
                (102, 5, "view", 855, now - timedelta(days=2)),
                (102, 5, "complete", 855, now - timedelta(days=2)),
                # Day -1: UI/UX Design (module 19)
                (106, 19, "view", 810, now - timedelta(days=1)),
                (106, 19, "complete", 810, now - timedelta(days=1)),
                # Today: UI/UX Design (module 20)
                (106, 20, "view", 1500, now - timedelta(minutes=30)),
                (106, 20, "complete", 1500, now - timedelta(minutes=15)),
            ]
            for jid, tid, action, dur, ts in demo_activities:
                db.add(Activity(
                    user_id=demo.id,
                    journey_id=jid,
                    tutorial_id=tid,
                    action=action,
                    duration_seconds=dur,
                    timestamp=ts,
                ))
            db.commit()
    except Exception as e:
        print(f"Warning: demo user seeding skipped ({e})")
    finally:
        db.close()

seed_demo_user()

app = FastAPI(
    title="AI Learning Insight API",
    description="Adaptive Learning Platform API with Machine Learning Learning Style Classification & AI Insights",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in CORS_ORIGINS else CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(learning_router)

from app.schemas.auth import UserProfileUpdate, UserResponse
from app.services.auth_service import get_current_user
from app.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session
from app.routes.auth import update_profile as auth_update_profile

@app.put("/api/profile/update", response_model=UserResponse, tags=["Profile"])
def update_profile_alias(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return auth_update_profile(profile_data, current_user, db)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "message": "AI Learning Insight API is running smoothly",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health Check"])
def health():
    return {"status": "healthy"}
