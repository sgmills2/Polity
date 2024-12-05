import sqlite3
import uvicorn

from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import List
from routes.congress import congress

app = FastAPI()

# Database connection
def get_db_connection():
    conn = sqlite3.connect('../database/polity.db')
    conn.row_factory = sqlite3.Row
    return conn

# Register Congress API route
congress_router = APIRouter()
app.include_router(congress_router, prefix="/congress")
app.include_router(congress)
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

# Models
class Politician(BaseModel):
    name: str
    voting_records: list
    lawsuits: list

class Member(BaseModel):
    id: int
    name: str
    state: str
    chamber: str

@app.get("/politicians/{name}")
def get_politician(name: str):
    conn = get_db_connection()
    politician = conn.execute('SELECT * FROM politicians WHERE name = ?', (name,)).fetchone()
    if politician is None:
        return {"error": "Politician not found"}
    return {"name": politician["name"], "voting_records": [], "lawsuits": []}

@app.get("/members/{chamber}/{state}", response_model=List[Member])
async def get_members_by_state(chamber: str, state: str):
    conn = get_db_connection()
    try:
        members = conn.execute(
            'SELECT id, name, state, chamber FROM politicians WHERE chamber = ? AND state = ?',
            (chamber.lower(), state.upper())
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
    finally:
        conn.close()