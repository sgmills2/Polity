from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# Database connection
def get_db_connection():
    conn = sqlite3.connect('../database/polity.db')
    conn.row_factory = sqlite3.Row
    return conn

# Models
class Politician(BaseModel):
    name: str
    voting_records: list
    lawsuits: list

@app.get("/politicians/{name}")
def get_politician(name: str):
    conn = get_db_connection()
    politician = conn.execute('SELECT * FROM politicians WHERE name = ?', (name,)).fetchone()
    if politician is None:
        return {"error": "Politician not found"}
    return {"name": politician["name"], "voting_records": [], "lawsuits": []}