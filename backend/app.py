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
from routes.congress import congress

# Load environment variables
load_dotenv()

# Get the absolute path to the database
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / 'database' / 'polity.db'

app = FastAPI(title="Polity API")

# Configure CORS
origins = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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
congress_router = APIRouter()
app.include_router(congress_router, prefix="/congress")
app.include_router(congress)

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
    with get_db_connection() as conn:
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
        
        return [
            {
                "id": member["id"],
                "name": member["name"],
                "state": member["state"],
                "chamber": member["chamber"]
            }
            for member in members
        ]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

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