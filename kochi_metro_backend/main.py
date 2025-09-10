
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.schedule import router as schedule_router
from app.api.ai_enhanced import router as ai_router
from app.db.client import db
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup
    print("Connecting to the database...")
    await db.connect()
    print("✅ Prisma Client connected successfully!")
    yield
    # On shutdown
    print("Disconnecting from the database...")
    await db.disconnect()


app = FastAPI(lifespan=lifespan)

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CORRECTED SECTION ---
# REMOVED the first, redundant include_router line.
# Now we only include the router once with the proper prefix and tags.
app.include_router(schedule_router, prefix="/api", tags=["Scheduling", "ML Admin"])
app.include_router(ai_router, tags=["AI Enhanced", "Explainable AI"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Kochi Metro AI Scheduler API"}

if __name__ == "__main__":
    print("Starting server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
