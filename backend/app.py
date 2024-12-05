import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import List

import uvicorn
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from routes.congress import router as congress_router

# Load environment variables
load_dotenv()

# Get the absolute path to the database
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / 'database' / 'polity.db'

app = FastAPI(title="Polity API")

# Configure CORS - make more permissive for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=False,  # Changed to False
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection management
@contextmanager
def get_db_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Register Congress API route
app.include_router(congress_router, prefix="/congress")

# Models
class Politician(BaseModel):
    name: str
    voting_records: list = []
    lawsuits: list = []

class Member(BaseModel):
    id: int
    name: str
    state: str
    chamber: str

# API Endpoints
@app.get("/politicians/{name}", response_model=Politician)
async def get_politician(name: str):
    with get_db_connection() as conn:
        politician = conn.execute(
            'SELECT * FROM politicians WHERE name = ?', 
            (name,)
        ).fetchone()
        
        if politician is None:
            raise HTTPException(status_code=404, detail="Politician not found")
        
        return {
            "name": politician["name"],
            "voting_records": [],
            "lawsuits": []
        }

@app.get("/members/{chamber}/{state}", response_model=List[Member])
async def get_members_by_state(chamber: str, state: str):
    print(f"Received request for chamber: {chamber}, state: {state}")  # Debug log
    with get_db_connection() as conn:
        try:
            members = conn.execute(
                '''
                SELECT id, name, state, chamber 
                FROM politicians 
                WHERE LOWER(chamber) = LOWER(?) 
                AND UPPER(state) = UPPER(?)
                ORDER BY name
                ''',
                (chamber, state)
            ).fetchall()
            print(f"Found {len(members)} members")  # Debug log
            return [
                {
                    "id": member["id"],
                    "name": member["name"],
                    "state": member["state"],
                    "chamber": member["chamber"]
                }
                for member in members
            ]
        except Exception as e:
            print(f"Database error: {str(e)}")  # Debug log
            raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test-db")
async def test_db():
    with get_db_connection() as conn:
        try:
            result = conn.execute('SELECT COUNT(*) as count FROM politicians').fetchone()
            return {"message": "Database connected", "politician_count": result['count']}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

if __name__ == "__main__":
    # Make sure the database directory exists
    os.makedirs(BASE_DIR / 'database', exist_ok=True)
    
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )