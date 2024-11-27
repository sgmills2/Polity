from fastapi import APIRouter
from backend.api.fetch_members import fetch_members
from backend.api.process_members import process_data

congress = APIRouter()

@congress.get("/api/congress-members")
def get_congress_members():
    raw_data = fetch_members()
    processed_data = process_data(raw_data)
    return processed_data