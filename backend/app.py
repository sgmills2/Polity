import os
from pathlib import Path
from typing import List

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .api.fetch_members import fetch_members
from .api.process_members import process_data

# Load environment variables
load_dotenv()

# Get the absolute path to the database
BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(title="Polity API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Member(BaseModel):
    id: str
    name: str
    state: str
    chamber: str
    party: str | None = None
    url: str | None = None
    next_election: str | None = None
    twitter_account: str | None = None
    facebook_account: str | None = None

@app.get("/members/{chamber}/{state}", response_model=List[Member])
async def get_members_by_state(chamber: str, state: str):
    try:
        raw_data = fetch_members(chamber, state)
        members = process_data(raw_data, chamber, state)
        return members
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )