from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.services.auth_service import hash_password
from app.routes.auth import router as auth_router
from app.routes.learning import router as learning_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed demo user if database is empty
def seed_demo_user():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.username == "siswa_demo").first():
            demo = User(
                username="siswa_demo",
                email="siswa@dicoding.com",
                hashed_password=hash_password("password123"),
                display_name="Siswa Teladan",
                image_path="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            )
            db.add(demo)
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
