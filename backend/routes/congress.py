from fastapi import APIRouter
import sys
from pathlib import Path

# Add project root to Python path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from database.seed_data import fetch_members

router = APIRouter()

@router.get("/members")
async def get_members():
    return fetch_members()